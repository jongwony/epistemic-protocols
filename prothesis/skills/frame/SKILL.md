---
name: frame
description: "Multi-perspective framing. When the right framework is absent, places analytical lenses before the user, then for each selected lens declares the substrate it needs (an abstract persona/capability) with advisory binding hints, and hands lens↔substrate pairs off for isolated execution — without executing or synthesizing. A single lens returns directly; multiple lenses with specialized substrate needs become a substrate-correspondence handoff. frame never synthesizes a multi-perspective result in its own context — convergence is claimable only by a substrate that ran the lenses in genuine isolation. Factual lookup or verification routes to fact-finding delegation; contested design, value, interpretation, or scope judgment routes to lens-conditioned inquiry. Type: (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition, then computing — for each selected lens — the **substrate** that lens needs and handing the lens↔substrate pairs off for isolated execution. The morphism is **select THEN bind-substrate THEN hand off**: for each lens, frame declares an authoritative `substrate_need` (the abstract persona/capability the lens requires — never a concrete agent) plus advisory `binding_hints` (an enumerated shortlist of candidate substrates that could fulfill the need). A single lens (or lenses with no specialized substrate beyond general-purpose) returns directly as a detailed lens; ≥2 lenses with substrate needs become a **substrate-correspondence** handoff for isolated host execution, with a `/conduct` nudge for non-trivial arrangement. frame does NOT arrange the perspectives (that is `/conduct`'s arrangement functor), does NOT execute the inquiry (that is the substrate, of which the main session is one realization), and does NOT synthesize a multi-perspective result in its own context. frame is the object supplier: it yields the analysis object plus its substrate need and stops at handoff. Type: `(FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition, then for each selected lens computing the **substrate** that lens needs — an authoritative `substrate_need` (the abstract persona/capability) plus advisory `binding_hints` (an enumerated candidate shortlist) — and handing the framed object off to the substrate. The framed object is a detailed lens (when a single lens, or no specialized substrate beyond general-purpose is needed → `LensReturn`) or a set of lens↔substrate pairs for isolated host execution (when ≥2 lenses carry substrate needs → `SubstrateCorrespondence`). frame is the **object supplier**: it yields the analysis object (the lens) and its substrate need, references `/conduct` for non-trivial arrangement, and stops at handoff. Arranging the objects — the order, independence, reconciliation, termination, and routing of multiple perspectives when non-trivial — is `/conduct`'s arrangement functor; executing the inquiry — spawn, isolated analysis, reconcile, synthesize — is the substrate's. frame never synthesizes a multi-perspective result in its own context: convergence is claimable only by a substrate that ran the lenses in genuine isolation.

```
── FLOW ──
Prothesis(U) → Q1(MB(U)) → MBᵥ → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
  bind_substrate(Pₛ) → {⟨pᵢ, substrate_needᵢ, binding_hintsᵢ⟩} →
  [single lens ∨ no specialized substrate: package(detailed lens) → LensReturn] |
  [≥2 lenses with substrate needs: pair(lens ↔ substrate_need + binding_hints ⊕ ConductRef) → SubstrateCorrespondence] →
  converge(trace) → handoff(FramedInquiry) → STOP

── MORPHISM ──
Inquiry
  → confirm(mission_brief)              -- validate inquiry framing with user
  → gather(context)                     -- targeted context acquisition guided by MBᵥ
  → propose(perspectives)               -- generate distinct analytical lenses from context
  → select(perspectives)                -- user chooses lenses via Cognitive Partnership Move (Constitution)
  → LensEstablished                     -- the analysis object (lens)
  → bind_substrate(perspectives)        -- per lens, compute substrate_need (authoritative abstract persona/capability) + binding_hints (advisory candidate shortlist); NEVER binds a concrete agent
  → discriminate(substrate_availability) -- single lens ∨ no specialized substrate beyond general-purpose → LensReturn; ≥2 lenses with substrate needs → SubstrateCorrespondence
  → handoff(framed_inquiry)             -- emit the framed object (detailed lens(es), or lens↔substrate pairs), then STOP — the substrate executes in isolation; non-trivial arrangement routes to /conduct; frame does NOT synthesize
  → FramedInquiry
requires: framework_absent(U)             -- runtime checkpoint (Phase 0)
deficit:  FrameworkAbsent                  -- activation precondition (Layer 1/2)
preserves: U                               -- original request read-only
invariant: Placement over Prescription; substrate-invariance (declares the NEED, never binds a concrete agent); no inline synthesis

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q1(MB) = Confirm: MB → MBᵥ                       -- extern (Mission Brief confirmation; the sole Phase 0 interaction — no mode question)
MBᵥ    = Verified MissionBrief (user-confirmed)
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U or at the Z zero-result surfacing; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 1)
         -- a single lens is valid (→ LensReturn); multiple lenses trigger substrate-correspondence. No two-lens minimum (no mode to satisfy)
Z      = ZeroCandidate: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅   -- Phase 2 guard: no candidate frameworks to place; surfaced as a finding (Constitution); responses: modify(field) (the J_mb constructor) | supply(Pᵦ') (perspective supply, typed via Pᵦ enrichment) | Esc — no FramedInquiry is emitted from this branch
LensEstablished = Pₛ where lens selection complete  -- the analysis object; Phase 3 binds each lens's substrate and discriminates the output by substrate availability
-- framed object: a detailed lens (LensReturn) or lens↔substrate pairs (SubstrateCorrespondence). frame supplies the OBJECT plus its substrate NEED and hands it off; the ARRANGEMENT over multiple objects is NOT produced here — it is /conduct's arrangement functor (referenced by ConductRef) --
SubstrateNeed = per-lens AUTHORITATIVE abstract persona/capability the lens requires (what kind of analyst/agent must run this lens) -- declares the NEED only; names no concrete agent (substrate-invariance). Extends the ChannelNeed pattern from channel to persona/capability
BindingHints  = per-lens ADVISORY, ENUMERATED shortlist of candidate substrates that could fulfill the SubstrateNeed (specific agent personas / subagent types; PREFER skill-bundled agents when they exist) -- NON-binding. Rationale: unless an agent is bundled with the skill, hosts rarely recognize available agents as substrates and default to general-purpose; the enumerated hint list makes specialized binding actually happen. Hints being advisory, substrate-invariance still holds
ConductRef = an advisory reference to /conduct for non-trivial arrangement (the prothesis→hyphegesis advisory edge): when the order, independence, reconciliation, termination, or routing of the perspectives is non-trivial, /conduct arranges them — frame names the reference, does not arrange
ChannelNeed = per-perspective evidence-channel need (code/workspace | canonical external source | instrumentation | user-tacit)  -- a channel-level signal for substrate tool authorization, no concrete provider named (utility-agnostic)
PerspectiveDirective = the per-lens output contract the substrate briefs each perspective with: { epistemic_contribution, framework_analysis, horizon_limits, assessment } over MBᵥ + the verbatim question; carries no spawn/peer mechanics (substrate-owned)
LensPair = ⟨lens: pᵢ, substrate_need: SubstrateNeed, binding_hints: BindingHints, per_perspective_directive: PerspectiveDirective, channel_need: ChannelNeed⟩  -- one lens bound to the substrate it needs (need authoritative, hints advisory)
LensReturn = { lenses: Pₛ, per_perspective_directive: PerspectiveDirective }  -- single lens, OR ≥2 lenses with NO specialized substrate beyond general-purpose: the detailed lens(es) returned directly. NO synthesis, NO convergence claim, NO isolated handoff
SubstrateCorrespondence = { pairs: {LensPair}, arrangement: ConductRef }  -- ≥2 lenses with substrate needs: lens↔(substrate_need + binding_hints) pairs handed off for ISOLATED host execution. Non-trivial arrangement → /conduct nudge. frame does NOT execute and does NOT synthesize
FramedInquiry = inj₁(LensReturn where single lens ∨ no specialized substrate) ⊕
                inj₂(SubstrateCorrespondence where ≥2 lenses with substrate needs)
        -- coproduct discriminated by SUBSTRATE AVAILABILITY (NOT a user-chosen mode): inj₁ → LensReturn (detailed lens(es) returned, no isolation handoff); inj₂ → SubstrateCorrespondence (lens↔substrate pairs handed off for isolated execution). NEITHER is executed by frame; convergence/synthesis is claimable only by a substrate that ran the lenses in genuine isolation. Advisory-edge consumers (Syneidesis, Aitesis, Analogia) branch on the inj₁/inj₂ tag — inj₁(LensReturn) is a context-binding lens handoff, inj₂(SubstrateCorrespondence) is a lens↔substrate handoff the isolated substrates execute.
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
Phase 0:  U → MB(U) → Q1(MB) → Stop → MBᵥ                       -- Mission Brief confirmation ONLY (no mode question) [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]; single lens is valid; on Z (zero candidates) surface the finding → Stop → route per LOOP (modify | Pᵦ' supply | Esc)
Phase 3:  LensEstablished → bind_substrate(Pₛ) → discriminate(substrate_availability) → [single lens ∨ no specialized substrate: LensReturn | ≥2 lenses with substrate needs: SubstrateCorrespondence(lens↔substrate pairs ⊕ ConductRef)] → converge(transformation trace) → handoff(FramedInquiry) → STOP  -- bind each lens's substrate, discriminate by availability, emit the framed object as the terminal relay, then halt (no gate, no dispatch, NO synthesis; substrate executes in isolation downstream)

── LOOP ──
After Phase 0 (Mission Brief confirmation only):
  MBᵥ = Q1 result → Phase 1 → Phase 2 → LensEstablished → Phase 3 (bind_substrate → discriminate → handoff) → terminate
  J_mb = confirm       → proceed to Phase 1 with MBᵥ
  J_mb = modify(field) → re-present Q1(MB') → Stop → MBᵥ
  -- Esc key → terminate (nothing compiled yet)

During Phase 2 (Perspective Placement):
  Z ({P₁...Pₙ} = ∅ ∧ Pᵦ = ∅) → present the zero-result finding with reasoning → Stop:
    modify(field) → re-present Q1(MB') → Stop → MBᵥ → re-enter Phase 1 (re-gather) → Phase 2
    supply(Pᵦ')   → Pᵦ := Pᵦ' (auto-included) → re-present Sc with ≥ 1 novel proposal
    Esc           → terminate (nothing compiled)
  -- a single selected lens is valid (→ LensReturn); no two-lens minimum and no under-minimum recovery (there is no mode to satisfy)
  -- no FramedInquiry is emitted from Z; the result equation is unchanged (FramedInquiry requires LensEstablished)

During Phase 3 (Bind Substrate & Handoff):
  bind_substrate(Pₛ) → for each pᵢ ∈ Pₛ compute ⟨substrate_needᵢ (authoritative abstract persona/capability), binding_hintsᵢ (advisory enumerated candidate shortlist; PREFER skill-bundled agents)⟩ → never bind a concrete agent
  discriminate(substrate_availability):
    single lens (|Pₛ| = 1) ∨ no specialized substrate beyond general-purpose → package the detailed lens(es): emit FramedInquiry = inj₁(LensReturn), hand off, terminate. NO synthesis, NO convergence claim, NO isolated handoff.
    ≥2 lenses with substrate needs → pair each lens with ⟨substrate_need + binding_hints⟩, attach the per-perspective directive + channel-need, and the /conduct arrangement reference for non-trivial arrangement → emit FramedInquiry = inj₂(SubstrateCorrespondence), hand off the lens↔substrate pairs for ISOLATED host execution, terminate. frame does NOT execute and does NOT synthesize.
  -- handoff is the completeness boundary: frame records the handoff and halts. The substrate — an agent team, a dynamic-workflow, isolated subagents, plan-mode, or the main session — runs each lens in genuine isolation and (only then) may claim convergence. Esc key → tool-level termination (nothing compiled yet).

Continue until convergence: FramedInquiry handed off (detailed lens(es) via LensReturn, or lens↔substrate pairs via SubstrateCorrespondence), or user Esc key.

Convergence evidence: At handoff, present the transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p's contribution as a lens of the framed object). SubstrateCorrespondence additionally surfaces each lens's substrate_need + binding_hints and the /conduct arrangement reference (for anything non-trivial) as relay text. Convergence-of-the-framing is demonstrated, not asserted — frame never asserts a multi-perspective convergence of the inquiry's findings (that is the isolated substrate's to claim).

── BOUNDARY ──
Q1(MB) (confirm)  = extern: Mission Brief confirmation boundary (the sole Phase 0 interaction)
G (observe)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
bind_substrate = purpose: per-lens substrate_need + binding_hints computation (relay; no user judgment beyond lens selection — frame declares the NEED, never binds a concrete agent)
discriminate  = purpose: coproduct selection by substrate availability (relay; entropy→0 once Pₛ and substrate needs are fixed; PerspectiveDirective wording is generated, but its contract shape is fixed by the template)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 MB_from_arg (extension)  → TextPresent+Proceed (when user_invoked ∧ explicit_arg(U); Q1=confirm default; Phase 2 Sc remains constitution as downstream correction opportunity)
Phase 0 Q1 (constitution)        → present (Mission Brief confirmation ONLY — no mode question; when no explicit_arg; Esc key → loop termination at LOOP level)
G (observe)                      → Read, Glob, Grep (meta-scope context acquisition guided by MBᵥ to identify relevant perspectives; not passed to the substrate — each perspective independently collects object-scope evidence through its own lens at execution time)
Sc (constitution)                → present (mandatory; multiSelect: true; lens selection is epistemic choice; single lens valid; Esc key → loop termination at LOOP level)
Phase 2 Z zero_result (constitution) → present (zero-candidate finding + reasoning; responses: modify(field) | supply(Pᵦ') → Pᵦ enrichment | Esc)
Phase 3 bind_substrate (sense)   → Internal operation (per-lens substrate_need (authoritative abstract persona/capability) + binding_hints (advisory candidate shortlist; PREFER skill-bundled agents); relay — no external tool, no user judgment beyond Pₛ; frame declares the NEED, never binds a concrete agent)
Phase 3 discriminate (sense)     → Internal operation (coproduct by substrate availability: single lens ∨ no specialized substrate → LensReturn = inj₁ FramedInquiry; ≥2 lenses with substrate needs → SubstrateCorrespondence (lens↔substrate pairs ⊕ per-perspective directive ⊕ channel-need ⊕ /conduct arrangement reference) = inj₂ FramedInquiry)
Phase 3 converge (extension)     → TextPresent+Proceed (convergence-of-framing evidence trace: per-perspective contribution; SubstrateCorrespondence additionally surfaces each lens's substrate_need + binding_hints + /conduct arrangement reference; NO synthesis of findings)
Phase 3 handoff (extension)      → TextPresent+STOP (emit the FramedInquiry — detailed lens(es) or lens↔substrate pairs — as the terminal relay, then halt; the substrate executes downstream in isolation. frame itself does NOT spawn or call Agent and does NOT synthesize — when the substrate is the main session (the default) it consumes the framed object; when isolated executors are elected, that dispatch is the substrate's action, not frame's morphism)
Λ (track)                        → TaskCreate/TaskUpdate (problem-to-solve + framing shifts durable; per-phase bookkeeping stays in session)
-- Substrate realization: the framed object is substrate-invariant; an agent-team, a dynamic-workflow, isolated subagents, plan-mode, and the main session are PEER substrates that may execute it — the substrate (or /conduct at arrangement time) owns the concrete execution tools, not frame. frame declares the per-lens substrate_need (authoritative) and surfaces binding_hints (advisory candidate substrates), the per-perspective channel-need, and the /conduct arrangement reference as handoff annotations — it NEVER binds a concrete agent. Topology→substrate feasibility (e.g. a dialectical arrangement requires persistent addressable peers; an independent-aggregate ⨾ adversarial pass over a static aggregate is realizable by a stateless pipeline) is the substrate's to enforce — surfaced by /conduct at arrangement time and by the substrate at execution time, never bound by frame. The (constitution)/(extension) markers above are the authoritative axis.

── CATEGORICAL NOTE ──
frame supplies analysis OBJECTS (lenses) plus each object's substrate NEED; /conduct is the ARRANGEMENT FUNCTOR over objects, generic in object type (objects = perspectives → multi-lens inquiry arrangement; objects = protocols → protocol-chain arrangement — the same functor, the same topology algebra). frame's framed object is a detailed lens (LensReturn) or lens↔substrate pairs (SubstrateCorrespondence), never an arrangement: the arrangement is the functor's action, attributed to /conduct, and any non-trivial arrangement routes there via ConductRef. frame binds the lens to the substrate it NEEDS (authoritative) with advisory binding_hints, but never to a concrete agent — substrate-invariance holds. Synthesis is NOT frame's: convergence/divergence/synthesis-basis are produced by an isolated substrate that ran the lenses, never compiled or asserted inside frame's own context — that belongs to the executed layer, outside frame's verification scope by design.

── MODE STATE ──
Λ = { phase: Phase, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), lens_pairs: Option({LensPair}), framed_output: Option(FramedInquiry), active: Bool }
Phase ∈ {0, 1, 2, 3}
-- no mode field (frame has no user-chosen mode): the framed output is discriminated at Phase 3 by substrate availability (LensReturn vs SubstrateCorrespondence), not by a Phase 0 choice. The section name is the cross-protocol structural-state slot, not a "mode" toggle.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Placement over Prescription**: AI places available perspectives before the user and leaves which to adopt to the user's judgment. The user selects.

## Mode Activation

> "Mode" here is the cross-protocol activation-layers slot (Layer 1 / Layer 2), NOT a recommend/inquire toggle — frame has no user-chosen mode.

### Activation

**Pre-activation routing**: Before accepting a `/frame` invocation, check the task shape. When the task is primarily finding or verifying facts, suggest fact-finding delegation instead; engage `/frame` when reasonable people could weigh contested design, value, interpretation, or scope differently and the work needs lens-conditioned evidence. This guard precedes activation — it decides whether to accept the invocation, not how the protocol behaves once active.

Command invocation activates the protocol until the framed object is handed off.

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

Consult `references/conceptual-foundations.md` for design rationale (Distinction from Socratic Method, Parametric Nature, Specialization) and activation edge cases (per-message application rules, deactivation triggers, trigger/skip heuristics).

## Protocol

### Phase 0: Intent Confirmation (Mission Brief)

Construct a Mission Brief from the user's request and **present** it for confirmation via Cognitive Partnership Move (Constitution). **Phase 0 is Mission Brief confirmation only — there is no mode question.** How the framed object is shaped (a detailed lens vs. lens↔substrate pairs) is decided at Phase 3 by substrate availability, not by a user choice here.

**Phase 0 establishes the Mission Brief as the primary context vehicle for the framed object** — it structurally guarantees that the handoff carries enough context for the substrate to brief each perspective, rather than depending on substrate inference. When `user_invoked ∧ explicit_arg(U)`, the Phase 0 MB_from_arg Extension entry takes the path: the MB is still constructed from U but proceeds without the Phase 0 Constitution interaction; AI uses `J_mb=confirm` as the default. Phase 2 S (perspective selection) remains Constitution, providing a downstream correction opportunity.

The coordinator infers the Mission Brief from U (the user's request):

- **Inquiry Intent**: What is being investigated and why
- **Expected Deliverable**: What form the output should take, inferred from the inquiry's purpose and intended use
- **Scope Constraint**: What is included and excluded from analysis

Present the inferred Mission Brief as text output:
- **Intent**: [inferred inquiry intent]
- **Deliverable**: [inferred expected deliverable]
- **Scope**: [inferred scope constraint]

Then **present** Q1 (Mission Brief confirmation only):

```
Q1. Mission Brief:
1. **Confirm** — proceed with this Mission Brief
2. **Modify intent** — adjust what is being investigated
3. **Modify deliverable** — adjust the expected output form
4. **Modify scope** — adjust inclusions/exclusions
```

**Pre-fill from explicit text**: `/frame "text"` → the MB is constructed from the provided text and takes the Phase 0 MB_from_arg Extension path (presented as relay text, then proceed — no Constitution stop); Phase 2 lens selection remains the downstream correction opportunity.

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context the handoff carries), not the epistemic layer. Phase 0 packages confirmed intent into a structured vehicle for substrate consumption — a prerequisite for a quality handoff, not a substitute for upstream intent resolution.

### Phase 1: Context Gathering

Gather context sufficient to formulate distinct perspectives, **guided by MBᵥ**.

MBᵥ.inquiry_intent and MBᵥ.scope_constraint direct which files, systems, and domains to investigate. Gathering intensity scales with MBᵥ complexity: narrow-scope inquiries with clear domain boundaries warrant targeted collection; broad or cross-domain inquiries warrant deeper investigation. This context guides perspective identification (meta-scope) — it is not the object-scope evidence each perspective will collect at execution time. Proceed to Phase 2 only after context is established.

### Phase 2: Prothesis (Perspective Placement)

After context gathering (Phase 1), **present** perspectives via Cognitive Partnership Move (Constitution) with `multiSelect: true`.

**Cross-session enrichment**: Prior framing experiences accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) guide Phase 2 perspective formulation bidirectionally — previously effective analytical lenses for similar domains provide starting hypotheses (exploitation), while prior coverage gaps (unaddressed horizon limits) signal domains where novel perspectives should be prioritized (exploration). In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior framework or perspective preferences, biasing the Phase 2 framework candidate set toward lenses the user has already found productive in this line of work. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

Constitution presentation yields turn for user response.

Each perspective is an **individual option**. Keep each option a single perspective so the user composes any combination directly. The user selects one or more perspectives directly. A single selected lens is valid (it returns directly at Phase 3 as a detailed lens); selecting multiple lenses triggers substrate-correspondence at Phase 3. There is no minimum-lens requirement.

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

During perspective formulation, note whether each candidate lens depends on evidence from code/workspace, canonical external sources, instrumentation, or user-tacit context. This is recorded as the lens's `channel_need` — a channel-level signal for later substrate tool authorization; it does not select or name a concrete provider. Also note, per lens, the kind of analyst/agent the lens requires — this feeds the Phase 3 `substrate_need` (authoritative) and `binding_hints` (advisory) computation; neither binds a concrete agent.

**Pre-suggested perspective handling**: When the user supplies perspectives in U (e.g., naming specific frameworks or roles), treat these as **pre-confirmed base perspectives** (Pᵦ):

- Pᵦ are **auto-included** in Pₛ; present only the AI-proposed novel perspectives as selectable options
- Constitution interaction presents only AI-proposed novel perspectives ({P₁...Pₙ} where Pᵢ ∉ Pᵦ)
- State Pᵦ in the question text as context (e.g., "Base: [Pᵦ names]. Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

### Phase 3: Bind Substrate & Handoff

Lens selection (Phase 2) established *which* perspectives. Phase 3 binds each lens to the substrate it needs, discriminates the framed object by substrate availability, and hands it off — frame does not execute and does not synthesize.

**Bind substrate (every lens)** — for each selected lens, compute:

- **`substrate_need`** (authoritative): the abstract persona/capability the lens requires — what kind of analyst/agent must run this lens (e.g. "a security-threat-modeling analyst", "a regulatory-compliance reviewer"). This declares the NEED only; it names no concrete agent. This is what preserves frame's substrate-invariance and extends the `channel_need` pattern from evidence-channel to persona/capability.
- **`binding_hints`** (advisory): an enumerated shortlist of candidate substrates that could fulfill the need — specific agent personas / subagent types. **Prefer skill-bundled agents when they exist.** Rationale: unless an agent is bundled with the skill, hosts rarely recognize the available agents as substrates and default to `general-purpose`; the explicit hint list is what makes specialized binding actually happen. Because the hints are advisory (the host may bind otherwise), substrate-invariance still holds.

**Discriminate by substrate availability** — the framed object is one of two:

**LensReturn** (`inj₁`) — when there is a **single lens**, OR when **no specialized substrate beyond `general-purpose`** is needed. Return the detailed lens(es) directly: the lens plus its per-perspective directive. **No synthesis, no convergence claim, no isolated handoff.** `FrameworkAbsent` is structurally addressed at the framing layer; downstream protocols or the user apply the lens to complete domain-specific resolution.

**SubstrateCorrespondence** (`inj₂`) — when there are **≥2 lenses with substrate needs**. Hand off lens↔(`substrate_need` + `binding_hints`) pairs for **isolated host execution** — each lens runs in a genuinely isolated substrate context. Attach the per-perspective directive, the channel-need, and the `/conduct` arrangement reference for non-trivial arrangement. No topology is elicited here: arranging multiple perspectives — their order, independence, reconciliation, termination, and routing — is `/conduct`'s arrangement functor (the `prothesis→hyphegesis` advisory edge), and a non-trivial arrangement triggers a `/conduct` nudge. frame does NOT execute and does NOT synthesize: convergence is claimable only by the isolated substrate that ran the lenses.

The `SubstrateCorrespondence` handoff carries, per lens:

1. **Lens** (`Pₛ`): the selected perspectives.
2. **`substrate_need`** (authoritative) + **`binding_hints`** (advisory candidate shortlist).
3. **Per-perspective directive** — the output contract the substrate briefs each perspective with (over MBᵥ + the verbatim question):

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

4. **`/conduct` arrangement reference** (`ConductRef`): when the perspectives' arrangement is non-trivial, the substrate routes to `/conduct` to design the topology. This is an advisory handoff, not a hard dependency. A non-trivial arrangement triggers a `/conduct` nudge.
5. **Isolation / reconciliation / synthesis directive** — the contract the **isolated substrate** executes (NOT frame; frame compiles the directive but never runs it):
   - **independence: isolated** — each perspective is analyzed in a genuinely isolated context, forming its assessment without seeing the others until reconciliation (independence-before-contamination; see `references/isolation-rationale.md`). `shared` independence is a non-trivial arrangement — route to `/conduct`, which records the relaxed-isolation degradation.
   - **reconciliation: independent-then-conditional-dialogue** — perspectives analyze independently; the substrate then checks results for the dialogue triggers below and reconciles only the triggered tensions. Unconditional debate, adversarial refutation, or any composite is a non-trivial arrangement — route to `/conduct`.
   - **synthesis: horizon-fusion** — the substrate integrates the perspective results (and any dialogue outcomes) into a single situated assessment per the synthesis contract below: integration of what the perspectives provided, not new analysis. **This synthesis is the isolated substrate's, never frame's** — frame ran no lens in its own context, so it has no findings to converge.
6. **`channel_need`** — the per-perspective evidence-channel signal for substrate tool authorization (utility-agnostic; no provider named).

**Dialogue triggers** (the directive's reconciliation criteria — the isolated substrate detects these in the perspective results and reconciles only the triggered tensions, citing evidence per trigger):

| Trigger | Heuristic | Evidence Required |
|---------|-----------|-------------------|
| **Contradiction** | perspective_i.assessment ≠ perspective_j.assessment on a shared referent | Which perspectives, which claims, on what topic |
| **Horizon Intersection** | perspective_i.horizon_limits ∩ perspective_j.epistemic_contribution ≠ ∅ | Which horizon limit overlaps which contribution |
| **Uncorroborated High-Stakes** | ∃ claim : stakes(claim) = high ∧ no other perspective confirms it | The claim, the perspective, why high-stakes |
| **Emergent** | Coherence tension outside the named types (e.g., non-overlapping coverage masking disagreement) | The tension, involved perspectives, why named triggers do not capture it |

**Synthesis contract** (the directive's synthesis shape — what the **isolated substrate** produces after running the lenses, never what frame executes — frame holds no per-lens findings of its own to synthesize):

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

**Handoff**: present the convergence-of-framing-evidence trace as relay text (the per-perspective contributions and, for `SubstrateCorrespondence`, each lens's `substrate_need` + `binding_hints`), then hand off `FramedInquiry` and **stop**. This is the completeness boundary — frame records the handoff and halts; the substrate (an agent team, a dynamic-workflow, isolated subagents, plan-mode, or the main session) runs each lens in genuine isolation and executes the directive. Substrate feasibility for the arrangement is the substrate's to enforce, surfaced as a handoff annotation, never bound by frame. frame presents no synthesized multi-perspective result — synthesis is the isolated substrate's claim alone.

**Revision threshold** (directive maintenance): When accumulated Emergent trigger detections across 3+ sessions cluster around a recognizable pattern outside the named types {Contradiction, Horizon Intersection, Uncorroborated High-Stakes}, the dialogue-trigger criteria warrant promotion to a new named trigger type. When accumulated false-positive triggers across 3+ sessions cluster around a specific named type, that type's heuristic warrants revision or demotion to Emergent.

## Rules

1. **Mission Brief confirmation**: Present the Mission Brief for confirmation via Cognitive Partnership Move (Constitution) before context gathering (Phase 0 → Phase 1) — Mission Brief confirmation only, no mode question. When `user_invoked ∧ explicit_arg(U)` (e.g. `/frame "text"`), the Phase 0 MB_from_arg Extension entry applies per TOOL GROUNDING (the authoritative axis): the MB constructed from the provided text is presented as relay text and proceeds with the `J_mb=confirm` default — Phase 2 lens selection remains the downstream Constitution correction opportunity.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding.
3. **Object supplier, not arranger or executor (core invariant)**: frame yields the analysis object (the lens) plus its substrate need, references `/conduct` for non-trivial arrangement, hands the framed object off to the substrate, and stops. frame does NOT elicit a topology (arrangement is `/conduct`'s functor) and does NOT execute the inquiry (spawn, isolated analysis, reconcile, synthesize belong to the substrate, of which the main session is one realization). frame compiles only the isolation/reconciliation/synthesis directive the isolated substrate executes; any non-trivial arrangement routes to `/conduct`. This is the Epistemic Completeness Boundary: frame's epistemic contribution is supplying the object and declaring its substrate need; execution and non-trivial arrangement are delegated.
4. **Substrate-invariance (declare the need, never bind the agent)**: frame computes a per-lens `substrate_need` (authoritative abstract persona/capability) and `binding_hints` (advisory, enumerated candidate substrates — prefer skill-bundled agents). The need is authoritative; the hints are advisory and the host may bind otherwise. frame NEVER binds a concrete agent — substrate-invariance holds. The hint list exists because, absent a skill-bundled agent, hosts default to `general-purpose` and miss specialized substrates; the enumerated hints make specialized binding happen without violating invariance.
5. **No inline synthesis (core invariant)**: frame never synthesizes a multi-perspective result in its own context. Convergence/synthesis is claimable only by a substrate that ran the lenses in genuine isolation. frame compiles the isolation/reconciliation/synthesis directive into the `SubstrateCorrespondence` handoff and the isolated substrate executes it (integration derives only from what perspectives provided — horizon fusion, not new analysis — with synthesis claims marked in the Synthesis Basis). A single lens returns directly (`LensReturn`) with no synthesis and no convergence claim.
6. **Independence-before-contamination (compiled directive)**: The directive specifies `independence: isolated` — each perspective forms its assessment without seeing the others until reconciliation. frame compiles this requirement into the handoff; the substrate enforces it. `shared` independence is a non-trivial arrangement that routes to `/conduct` (which records the relaxed-isolation degradation). `LensReturn` is exempt — it ships a lens, no execution directive.
7. **Verbatim transmission**: The per-perspective directive carries the original question unchanged; the substrate passes it to each perspective verbatim.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. All analytical context belongs in the pre-gate text.
9. **Convergence evidence**: Present the transformation trace before handoff (detailed lens(es) via `LensReturn`, or lens↔substrate pairs via `SubstrateCorrespondence`); per-perspective contribution is the required evidence. The trace demonstrates convergence-of-framing only — never a synthesized convergence of the inquiry's findings, which frame does not produce. The trace is relay (presented, then proceed) — there is no post-handoff sufficiency gate, because frame does not execute and has nothing to iterate.
10. **Zero-result surfacing**: If Phase 2 generation yields no candidate frameworks (Z: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅), present the finding with reasoning. Responses route to existing paths — modify the Mission Brief (re-present Q1, re-gather), supply perspectives directly (enter as Pᵦ), or exit (terminate, nothing compiled); no FramedInquiry is emitted from this branch.
11. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option (the Phase 2 lens options) must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
12. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text or convergence traces.
15. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

## Adversarial Guards

- **false-convergence** (a.k.a. **inline-synthesis-creep**): frame compiles all the selected lenses, then reasons through every perspective *inside its own single context* and presents the result as a multi-perspective "convergence" or "synthesis." This is the bug this protocol exists to kill: one context produced all the lenses, so the agreement is structurally guaranteed — bias dressed up as multi-perspective consensus. Concretely: a single session reasons "from the security lens X, from the cost lens Y, from the UX lens Z — these converge on W" without ever running each lens in a separate isolated context. Guard: frame NEVER synthesizes a multi-perspective result in its own context. With ≥2 lenses carrying substrate needs, frame emits `SubstrateCorrespondence` (lens↔substrate pairs) and stops — convergence/synthesis is claimable only by a substrate that ran the lenses in genuine isolation. A single lens returns as `LensReturn` with no convergence claim. Any "convergence"/"synthesis"/"the perspectives agree" sentence authored in frame's own context is the failure.
- **arranger-creep**: frame slides back into eliciting a deliberation topology (an axis-by-axis arrangement of the perspectives) instead of routing non-trivial arrangement to `/conduct`. Guard: frame compiles only the isolation/reconciliation/synthesis directive the isolated substrate executes; any non-trivial arrangement (shared independence, unconditional debate, adversarial refutation, composites, dependency ordering) routes to `/conduct`. Eliciting a topology inside frame is the failure.
- **executor-creep**: frame begins executing the inquiry — creating a team, spawning perspectives, awaiting completion, synthesizing — instead of handing the framed object off. Guard: frame stops at handoff; execution belongs to the substrate (Epistemic Completeness Boundary). The deliverable is the framed object (detailed lens(es) or lens↔substrate pairs), not a synthesis.
- **binding-overreach**: frame binds a concrete agent instead of declaring the abstract `substrate_need`, or presents `binding_hints` as mandatory rather than advisory. Guard: `substrate_need` is authoritative but abstract (persona/capability, no concrete agent); `binding_hints` is an advisory shortlist the host may override. frame names the need and suggests candidates — it never binds the agent. Substrate-invariance is the invariant.
- **lens-redundancy**: proposed perspectives collapse to variations of one framing, so the option set offers no productive tension. Guard: each lens must offer a distinct epistemic framework; surface the redundancy as an epistemic signal and re-propose with genuine tension rather than padding the option space.

## Known Limitations

**Substrate execution out of scope**: The framed object's realization — isolation fidelity, dialogue mechanics, synthesis quality — depends on the executing substrate's capabilities. frame surfaces the per-lens `substrate_need` + `binding_hints`, the per-perspective channel-need, and the `/conduct` arrangement reference as handoff annotations, but does not enforce realizability; when a substrate cannot realize the arrangement (e.g. plan-mode cannot host a dialectical arrangement with no persistent addressable peers), the substrate — or `/conduct` at arrangement time — declares the degradation. This is a non-epistemic substrate boundary: frame's contract ends at the handoff. The `isolated` requirement in the directive is frame's compiled requirement, but frame cannot verify its enforcement post-handoff — degradation detection is the substrate's responsibility. When `/conduct` designs a non-trivial arrangement, it supplements the per-perspective directive with that arrangement's peer mechanics before the substrate briefs perspectives — frame's compiled directive carries the default isolation/reconciliation/synthesis contract only.

**Binding hints are advisory, not a registry**: `binding_hints` is frame's best enumerated guess at candidate substrates (preferring skill-bundled agents); it is not an authoritative agent registry and may name a substrate the host lacks or omit one the host has. The host binds against its actual available agents, using the hints to avoid the `general-purpose` default — the authoritative contract is the abstract `substrate_need`, not any concrete hint.

**SubstrateCorrespondence handoff completes the morphism, not the inquiry**: `FramedInquiry` is emitted at handoff — the framing-layer deficit (`FrameworkAbsent`) is resolved by the framed object, while the object-level inquiry remains open until the isolated substrate executes it. An unexecuted handoff is a completed frame morphism and an unrealized inquiry, by design (the same layering as `LensReturn` partial resolution below).

**LensReturn partial resolution**: `LensReturn` ships a lens (or lenses with no specialized substrate), not a resolved inquiry. `FrameworkAbsent` is addressed at the framing layer, but domain-specific resolution requires a downstream protocol or the user applying the lens. There is no inline synthesis even when multiple lenses return this way — frame ran none of them in isolation, so it makes no convergence claim.
