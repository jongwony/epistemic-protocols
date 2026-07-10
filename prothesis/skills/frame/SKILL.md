---
name: frame
description: "Multi-perspective framing — a pure lens-formation tool. When the right framework is absent, places analytical lenses before the user, then for each selected lens declares the substrate it needs (an abstract persona/capability) with advisory binding hints and a channel need, and hands lens↔substrate pairs off — without executing, isolating, arranging, or synthesizing. A single lens returns directly; multiple lenses where at least one needs a specialized substrate become a substrate-correspondence handoff that nudges /conduct for the isolation + arrangement + reconciliation + synthesis apparatus, which the isolated substrate runs. frame never synthesizes a multi-perspective result in its own context and never realizes isolation — convergence is claimable only by a substrate that ran the lenses in genuine isolation. Factual lookup or verification routes to fact-finding delegation; contested design, value, interpretation, or scope judgment routes to lens-conditioned inquiry. Type: (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition, then computing — for each selected lens — the **substrate** that lens needs and handing the lens↔substrate pairs off. The morphism is **select THEN bind-substrate THEN hand off**: for each lens, frame declares an authoritative `substrate_need` (the abstract persona/capability the lens requires — never a concrete agent) plus advisory `binding_hints` (an enumerated shortlist of candidate substrates that could fulfill the need) and the lens's channel need. A single lens (or lenses with no specialized substrate beyond general-purpose) returns directly as a detailed lens; ≥2 lenses with at least one specialized substrate need become a **substrate-correspondence** handoff that nudges `/conduct` for the isolation + arrangement + reconciliation + synthesis apparatus. frame does NOT arrange the perspectives, does NOT realize their isolation, does NOT execute the inquiry, and does NOT synthesize a multi-perspective result in its own context — the isolated execution arrangement (isolation, reconciliation/dialogue, synthesis) is `/conduct`'s to design and the substrate's to run, reached via the `/conduct` nudge that accompanies every `SubstrateCorrespondence` handoff. frame is the lens-formation tool: it forms the analysis object, declares its substrate need + channel need, nudges `/conduct`, and stops at handoff. Type: `(FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition, then for each selected lens computing the **substrate** that lens needs — an authoritative `substrate_need` (the abstract persona/capability) plus advisory `binding_hints` (an enumerated candidate shortlist) — and handing the framed object off. The framed object is a detailed lens (when a single lens, or no specialized substrate beyond general-purpose is needed → `LensReturn`) or a set of lens↔substrate pairs (when ≥2 lenses are present and at least one carries a specialized substrate need → `SubstrateCorrespondence`). frame is the **lens-formation tool**: it yields the analysis object (the lens) and its substrate need + channel need, nudges `/conduct` for the isolation + arrangement + synthesis apparatus, and stops at handoff. Isolating the perspectives, arranging them — the order, independence, reconciliation, termination, and routing — and integrating their results is `/conduct`'s to design (reached via the nudge) and the substrate's to execute (spawn, isolated analysis, reconcile, synthesize). frame neither realizes isolation nor synthesizes a multi-perspective result in its own context: convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts.

```
── FLOW ──
Prothesis(U) → Q1(MB(U)) → MBᵥ → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
  bind_substrate(Pₛ) → {⟨pᵢ, substrate_needᵢ, binding_hintsᵢ, channel_needᵢ⟩} →
  [single lens ∨ no specialized substrate: package(detailed lens) → LensReturn] |
  [≥2 lenses with at least one specialized substrate need: pair(lens ↔ substrate_need + binding_hints) ⊕ nudge(ConductRef) → SubstrateCorrespondence] →
  converge(trace) → handoff(FramedInquiry) → STOP
  -- ConductRef = the /conduct nudge that carries isolation + arrangement + reconciliation + synthesis; frame forms lenses and STOPS, never realizing isolation or asserting convergence

── MORPHISM ──
Inquiry
  → confirm(mission_brief)              -- validate inquiry framing with user
  → gather(context)                     -- targeted context acquisition guided by MBᵥ
  → propose(perspectives)               -- generate distinct analytical lenses from context
  → select(perspectives)                -- user chooses lenses via Cognitive Partnership Move (Constitution)
  → LensEstablished                     -- the analysis object (lens)
  → bind_substrate(perspectives)        -- per lens, compute substrate_need (authoritative abstract persona/capability) + binding_hints (advisory candidate shortlist) + channel_need; NEVER binds a concrete agent
  → discriminate(substrate_specialization_need) -- single lens ∨ no specialized substrate beyond general-purpose → LensReturn; ≥2 lenses with at least one specialized substrate need → SubstrateCorrespondence
  → handoff(framed_inquiry)             -- emit the framed object (detailed lens(es), or lens↔substrate pairs ⊕ /conduct nudge), record the handoff, then STOP — frame does NOT realize isolation, arrange, execute, or synthesize; the isolation + arrangement + synthesis apparatus is /conduct's to design (via the nudge) and the isolated substrate's to run
  → FramedInquiry
requires: framework_absent(U)             -- runtime checkpoint (Phase 0)
deficit:  FrameworkAbsent                  -- activation precondition (Layer 1/2)
preserves: U                               -- original request read-only
invariant: Placement over Prescription; substrate-invariance (declares the NEED, never binds a concrete agent); no inline synthesis and no inline isolation (convergence claimable only by the isolated substrate, which frame neither performs nor asserts)

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q1     : MB → J_mb                               -- extern (Mission Brief confirmation/modification; the sole Phase 0 interaction — no mode question); answer type is J_mb, not MBᵥ directly
MBᵥ    = Verified MissionBrief (user-confirmed)  -- DERIVED when J_mb = confirm; on J_mb = modify(field), Q1 re-presents over the revised MB' until confirm yields MBᵥ
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U or at the Z zero-result surfacing; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 1)
         -- a single lens is valid (→ LensReturn); multiple lenses where AT LEAST ONE needs a specialized substrate trigger substrate-correspondence, while multiple lenses with no specialized substrate beyond general-purpose return directly (→ LensReturn). A mixed selection (some specialized, some general-purpose) has at least one specialized need, so it routes to SubstrateCorrespondence — the branch is total over every selection (single ∨ all-general-purpose → LensReturn; ≥2 ∧ ≥1 specialized → SubstrateCorrespondence). The branch is decided at Phase 3 by substrate specialization need, not by lens count. No two-lens minimum (no mode to satisfy)
Z      = ZeroCandidate: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅   -- Phase 2 guard: no candidate frameworks to place; surfaced as a finding (Constitution); responses: modify(field) (the J_mb constructor) | supply(Pᵦ') (perspective supply, typed via Pᵦ enrichment) | Esc — no FramedInquiry is emitted from this branch
LensEstablished = Pₛ where lens selection complete  -- the analysis object; Phase 3 binds each lens's substrate and discriminates the output by substrate specialization need
-- framed object: a detailed lens (LensReturn) or lens↔substrate pairs (SubstrateCorrespondence). frame forms the OBJECT plus its substrate NEED and hands it off; the ARRANGEMENT over multiple objects — and their isolation, reconciliation, and synthesis — is NOT produced here: it is /conduct's to design (referenced by ConductRef, carried as the nudge) and the substrate's to run --
SubstrateNeed = per-lens AUTHORITATIVE abstract persona/capability the lens requires (what kind of analyst/agent must run this lens) -- declares the NEED only; names no concrete agent (substrate-invariance). Extends the ChannelNeed pattern from channel to persona/capability
BindingHints  = per-lens ADVISORY, ENUMERATED shortlist of candidate substrates that could fulfill the SubstrateNeed (specific agent personas / subagent types; PREFER skill-bundled agents when they exist) -- NON-binding. Rationale: unless an agent is bundled with the skill, hosts rarely recognize available agents as substrates and default to general-purpose; the enumerated hint list makes specialized binding actually happen. Hints being advisory, substrate-invariance still holds
ConductRef = the /conduct nudge that accompanies every SubstrateCorrespondence handoff (the prothesis→hyphegesis advisory edge): it routes the isolation + arrangement (order, independence, reconciliation, termination, routing) + synthesis apparatus to /conduct, which designs it, and the isolated substrate, which runs it — frame names the reference, never realizing isolation, arranging, or synthesizing
ChannelNeed = per-perspective evidence-channel need (code/workspace | canonical external source | instrumentation | user-tacit)  -- a channel-level signal for substrate tool authorization, no concrete provider named (utility-agnostic)
PerspectiveDirective = the per-lens output contract that briefs each perspective: { epistemic_contribution, framework_analysis, horizon_limits, assessment } over MBᵥ + the verbatim question; part of forming the lens (per-lens, not cross-lens). The CROSS-lens reconciliation/synthesis machinery is NOT here — it is /conduct's. Carries no spawn/peer mechanics (substrate-owned)
LensPair = ⟨lens: pᵢ, substrate_need: SubstrateNeed, binding_hints: BindingHints, per_perspective_directive: PerspectiveDirective, channel_need: ChannelNeed⟩  -- one lens bound to the substrate it needs (need authoritative, hints advisory)
LensReturn = { lenses: { ⟨pᵢ, per_perspective_directive: PerspectiveDirective, channel_need: ChannelNeed⟩ } }  -- single lens, OR ≥2 lenses with NO specialized substrate beyond general-purpose (substrate_need is general-purpose by definition): each detailed lens returned directly WITH its own per-lens directive and channel_need (the per-lens tool-authorization signal Phase 3 computes for every lens — preserving the lens↔channel mapping even with multiple lenses). NO synthesis, NO convergence claim, NO isolated handoff
SubstrateCorrespondence = { pairs: {LensPair}, arrangement: ConductRef }  -- ≥2 lenses with at least one specialized substrate need: lens↔(substrate_need + binding_hints + per_perspective_directive + channel_need) pairs, handed off with the /conduct nudge (ConductRef) that carries the isolation + arrangement + reconciliation + synthesis concern. frame forms the pairs and STOPS — it does NOT realize isolation, arrange, execute, or synthesize
FramedInquiry = inj₁(LensReturn where single lens ∨ no specialized substrate) ⊕
                inj₂(SubstrateCorrespondence where ≥2 lenses with at least one specialized substrate need)
        -- coproduct discriminated by SUBSTRATE SPECIALIZATION NEED (NOT a user-chosen mode): inj₁ → LensReturn (detailed lens(es) returned, no isolation handoff); inj₂ → SubstrateCorrespondence (lens↔substrate pairs handed off ⊕ /conduct nudge). NEITHER is executed by frame; isolation/convergence/synthesis is claimable only by a substrate that ran the lenses in genuine isolation, which frame neither performs nor asserts. Advisory-edge consumers (Syneidesis, Aitesis, Analogia) branch on the inj₁/inj₂ tag — inj₁(LensReturn) is a context-binding lens handoff, inj₂(SubstrateCorrespondence) is a lens↔substrate handoff the isolated substrates execute under the arrangement /conduct designs.
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
Phase 0:  U → MB(U) → Q1(MB) → Stop → J_mb → [confirm: derive MBᵥ | modify(field): MB' → re-present Q1(MB') → Stop → J_mb]   -- Mission Brief confirmation ONLY (no mode question); MBᵥ is derived on confirm, not Q1's direct return [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]; single lens is valid; on Z (zero candidates) surface the finding → Stop → route per LOOP (modify | Pᵦ' supply | Esc)
Phase 3:  LensEstablished → bind_substrate(Pₛ) → discriminate(substrate_specialization_need) → [single lens ∨ no specialized substrate: LensReturn | ≥2 lenses with at least one specialized substrate need: SubstrateCorrespondence(lens↔substrate pairs) ⊕ nudge(ConductRef)] → converge(transformation trace) → handoff(FramedInquiry) → STOP  -- bind each lens's substrate, discriminate by substrate specialization need, emit the framed object as the terminal relay with the /conduct nudge, then halt (no gate, no dispatch, NO isolation, NO synthesis; isolation + arrangement + synthesis is /conduct's to design and the isolated substrate's to run downstream)

── LOOP ──
After Phase 0 (Mission Brief confirmation only):
  J_mb = Q1 result; MBᵥ derived on confirm → Phase 1 → Phase 2 → LensEstablished → Phase 3 (bind_substrate → discriminate → handoff) → terminate
  J_mb = confirm       → proceed to Phase 1 with MBᵥ
  J_mb = modify(field) → re-present Q1(MB') → Stop → J_mb (loop until confirm derives MBᵥ)
  -- Esc key → terminate (nothing compiled yet)

During Phase 2 (Perspective Placement):
  Z ({P₁...Pₙ} = ∅ ∧ Pᵦ = ∅) → present the zero-result finding with reasoning → Stop:
    modify(field) → re-present Q1(MB') → Stop → J_mb (loop until confirm derives MBᵥ) → re-enter Phase 1 (re-gather) → Phase 2
    supply(Pᵦ')   → Pᵦ := Pᵦ' (auto-included) → re-present Sc with ≥ 1 novel proposal
    Esc           → terminate (nothing compiled)
  -- a single selected lens is valid (→ LensReturn); no two-lens minimum and no under-minimum recovery (there is no mode to satisfy)
  -- no FramedInquiry is emitted from Z; the result equation is unchanged (FramedInquiry requires LensEstablished)

During Phase 3 (Bind Substrate & Handoff):
  bind_substrate(Pₛ) → for each pᵢ ∈ Pₛ compute ⟨substrate_needᵢ (authoritative abstract persona/capability), binding_hintsᵢ (advisory enumerated candidate shortlist; PREFER skill-bundled agents), channel_needᵢ⟩ → never bind a concrete agent
  discriminate(substrate_specialization_need):
    single lens (|Pₛ| = 1) ∨ no specialized substrate beyond general-purpose → package the detailed lens(es): emit FramedInquiry = inj₁(LensReturn), hand off, terminate. NO synthesis, NO convergence claim, NO isolated handoff.
    ≥2 lenses with at least one specialized substrate need → pair each lens with ⟨substrate_need + binding_hints + per-perspective directive + channel-need⟩ → emit FramedInquiry = inj₂(SubstrateCorrespondence) with the /conduct nudge (ConductRef), hand off the lens↔substrate pairs, terminate. frame does NOT realize isolation, arrange, execute, or synthesize.
  -- handoff is the completeness boundary: frame records the handoff and halts. frame does NOT realize isolation — the isolated execution arrangement (isolation, reconciliation/dialogue, synthesis) is /conduct's to design (the /conduct nudge accompanies every SubstrateCorrespondence handoff) and the substrate's to run (an agent team, a dynamic-workflow, isolated subagents, or plan-mode). Convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts. Esc key → tool-level termination (nothing compiled yet).

Continue until convergence: FramedInquiry handed off (detailed lens(es) via LensReturn, or lens↔substrate pairs via SubstrateCorrespondence), or user Esc key.

Convergence evidence: At handoff, present the transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p's contribution as a lens of the framed object). SubstrateCorrespondence additionally surfaces each lens's substrate_need + binding_hints + channel-need and the /conduct nudge (which carries the isolation + arrangement + synthesis apparatus) as relay text. Convergence-of-the-framing is demonstrated, not asserted — frame never asserts a multi-perspective convergence of the inquiry's findings (that is the isolated substrate's to claim, under the arrangement /conduct designs).

── BOUNDARY ──
Q1(MB) (confirm)  = extern: Mission Brief confirmation boundary (the sole Phase 0 interaction)
G (observe)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
bind_substrate = purpose: per-lens substrate_need + binding_hints computation (relay; no user judgment beyond lens selection — frame declares the NEED, never binds a concrete agent)
discriminate  = purpose: coproduct selection by substrate specialization need (relay; entropy→0 once Pₛ and substrate needs are fixed; PerspectiveDirective wording is generated, but its contract shape is fixed by the template)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 MB_from_arg (extension)  → TextPresent+Proceed (when user_invoked ∧ explicit_arg(U); Q1=confirm default; Phase 2 Sc remains constitution as downstream correction opportunity)
Phase 0 Q1 (constitution)        → present (Mission Brief confirmation ONLY — no mode question; when no explicit_arg; Esc key → loop termination at LOOP level)
G (observe)                      → Read, Glob, Grep (meta-scope context acquisition guided by MBᵥ to identify relevant perspectives; not passed to the substrate — each perspective independently collects object-scope evidence through its own lens at execution time)
Sc (constitution)                → present (mandatory; multiSelect: true; lens selection is epistemic choice; single lens valid; Esc key → loop termination at LOOP level)
Phase 2 Z zero_result (constitution) → present (zero-candidate finding + reasoning; responses: modify(field) | supply(Pᵦ') → Pᵦ enrichment | Esc)
Phase 3 bind_substrate (sense)   → Internal operation (per-lens substrate_need (authoritative abstract persona/capability) + binding_hints (advisory candidate shortlist; PREFER skill-bundled agents) + channel_need; relay — no external tool, no user judgment beyond Pₛ; frame declares the NEED, never binds a concrete agent)
Phase 3 discriminate (sense)     → Internal operation (coproduct by substrate specialization need: single lens ∨ no specialized substrate → LensReturn = inj₁ FramedInquiry; ≥2 lenses with at least one specialized substrate need → SubstrateCorrespondence (lens↔substrate pairs ⊕ per-perspective directive ⊕ channel-need) with the /conduct nudge = inj₂ FramedInquiry)
Phase 3 converge (extension)     → TextPresent+Proceed (convergence-of-framing evidence trace: per-perspective contribution; SubstrateCorrespondence additionally surfaces each lens's substrate_need + binding_hints + channel-need + the /conduct nudge; NO synthesis of findings, NO isolation realized)
Phase 3 handoff (extension)      → TextPresent+STOP (emit the FramedInquiry — detailed lens(es) or lens↔substrate pairs ⊕ /conduct nudge — as the terminal relay, record the handoff, then halt; frame does NOT realize isolation, arrange, execute, or synthesize — it does NOT spawn or call Agent. The isolation + arrangement + synthesis apparatus is /conduct's to design (via the nudge) and the substrate's to run; when the substrate is the main session (the default) it consumes the framed object, when isolated executors are elected that dispatch is the substrate's action, not frame's morphism)
Λ (track)                        → TaskCreate/TaskUpdate (problem-to-solve + framing shifts durable; per-phase bookkeeping stays in session)
-- Substrate realization: the framed object is substrate-invariant; an agent-team, a dynamic-workflow, isolated subagents, and plan-mode are PEER substrates that may execute it (the main session is a peer substrate only as an orchestrator that elects isolated executors, never isolating the lenses inline in its own context) — the substrate (or /conduct at arrangement time) owns the concrete execution tools and realizes isolation, not frame. frame declares the per-lens substrate_need (authoritative) and surfaces binding_hints (advisory candidate substrates), the per-perspective channel-need, and the /conduct nudge as handoff annotations — it NEVER binds a concrete agent and NEVER realizes isolation. Isolation + arrangement + reconciliation + synthesis is /conduct's to design (via the nudge) and the substrate's to run. Topology→substrate feasibility (e.g. a dialectical arrangement requires persistent addressable peers; an independent-aggregate ⨾ adversarial pass over a static aggregate is realizable by a stateless pipeline) is the substrate's to enforce — surfaced by /conduct at arrangement time and by the substrate at execution time, never bound by frame. The (constitution)/(extension) markers above are the authoritative axis.

── CATEGORICAL NOTE ──
frame forms analysis OBJECTS (lenses) plus each object's substrate NEED; /conduct is the ARRANGEMENT FUNCTOR over objects, generic in object type (objects = perspectives → multi-lens inquiry arrangement; objects = protocols → protocol-chain arrangement — the same functor, the same topology algebra). frame's framed object is a detailed lens (LensReturn) or lens↔substrate pairs (SubstrateCorrespondence), never an arrangement: the arrangement — together with the isolation and synthesis it governs — is the functor's action, attributed to /conduct and reached via the ConductRef nudge that accompanies every SubstrateCorrespondence handoff. frame binds the lens to the substrate it NEEDS (authoritative) with advisory binding_hints, but never to a concrete agent — substrate-invariance holds. Isolation and synthesis are NOT frame's: convergence/divergence/synthesis-basis are produced by an isolated substrate that ran the lenses (under the arrangement /conduct designs), never realized or asserted inside frame's own context — that belongs to the executed layer, outside frame's verification scope by design.

── MODE STATE ──
Λ = { phase: Phase, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), lens_pairs: Option({LensPair}), framed_output: Option(FramedInquiry), active: Bool }
Phase ∈ {0, 1, 2, 3}
-- no mode field (frame has no user-chosen mode): the framed output is discriminated at Phase 3 by substrate specialization need (LensReturn vs SubstrateCorrespondence), not by a Phase 0 choice. The section name is the cross-protocol structural-state slot, not a "mode" toggle.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
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

Construct a Mission Brief from the user's request and **present** it for confirmation via Cognitive Partnership Move (Constitution). **Phase 0 is Mission Brief confirmation only — there is no mode question.** How the framed object is shaped (a detailed lens vs. lens↔substrate pairs) is decided at Phase 3 by substrate specialization need, not by a user choice here.

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

After context gathering (Phase 1), **present** perspectives via Cognitive Partnership Move (Constitution) as a multi-select confirmation.

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 2 perspective formulation; the constitutive judgment remains with the user.

Constitution presentation yields turn for user response.

Each perspective is an **individual option**. Keep each option a single perspective so the user composes any combination directly. The user selects one or more perspectives directly. A single selected lens is valid (it returns directly at Phase 3 as a detailed lens); selecting multiple lenses **where at least one needs a specialized substrate** triggers substrate-correspondence at Phase 3, while multiple lenses with no specialized substrate beyond general-purpose return directly as `LensReturn`. The branch is decided at Phase 3 by substrate specialization need, not by lens count alone. There is no minimum-lens requirement.

```
question: "Which lens(es) for this inquiry?"
selection: multiple
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
- State Pᵦ as pre-gate text output before the gate (e.g., "Base perspectives already included: [Pᵦ names]"), per Rule 8 (Context-Question Separation); the question itself stays essential-only (e.g., "Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

### Phase 3: Bind Substrate & Handoff

Lens selection (Phase 2) established *which* perspectives. Phase 3 binds each lens to the substrate it needs, discriminates the framed object by substrate specialization need, and hands it off — frame does not realize isolation, arrange, execute, or synthesize.

**Bind substrate (every lens)** — for each selected lens, compute:

- **`substrate_need`** (authoritative): the abstract persona/capability the lens requires — what kind of analyst/agent must run this lens (e.g. "a security-threat-modeling analyst", "a regulatory-compliance reviewer"). This declares the NEED only; it names no concrete agent. This is what preserves frame's substrate-invariance and extends the `channel_need` pattern from evidence-channel to persona/capability.
- **`binding_hints`** (advisory): an enumerated shortlist of candidate substrates that could fulfill the need — specific agent personas / subagent types. **Prefer skill-bundled agents when they exist.** Rationale: unless an agent is bundled with the skill, hosts rarely recognize the available agents as substrates and default to `general-purpose`; the explicit hint list is what makes specialized binding actually happen. Because the hints are advisory (the host may bind otherwise), substrate-invariance still holds.

**Discriminate by substrate specialization need** — the framed object is one of two:

**LensReturn** (`inj₁`) — when there is a **single lens**, OR when **no specialized substrate beyond `general-purpose`** is needed. Return the detailed lens(es) directly: each lens plus its per-perspective directive and channel-need (per lens, preserving the lens↔channel mapping even with multiple lenses). **No synthesis, no convergence claim, no isolated handoff.** `FrameworkAbsent` is structurally addressed at the framing layer; downstream protocols or the user apply the lens to complete domain-specific resolution.

**SubstrateCorrespondence** (`inj₂`) — when there are **≥2 lenses with at least one specialized substrate need**. Hand off lens↔(`substrate_need` + `binding_hints`) pairs, each carrying the per-perspective directive and the channel-need, **with a `/conduct` nudge**. The nudge carries the whole isolated-execution apparatus: isolating the perspectives (so each forms its assessment without seeing the others), arranging them — their order, independence, reconciliation, termination, and routing — and integrating their results. That apparatus is `/conduct`'s arrangement functor to design (the `prothesis→hyphegesis` advisory edge) and the isolated substrate's to run. frame does NOT realize isolation, arrange, execute, or synthesize: convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts.

The `SubstrateCorrespondence` handoff carries, per lens:

1. **Lens** (`pᵢ`): the single selected perspective this pair binds (one lens per pair).
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

4. **`channel_need`** — the per-perspective evidence-channel signal for substrate tool authorization (utility-agnostic; no provider named).
5. **`/conduct` nudge** (`ConductRef`): every `SubstrateCorrespondence` handoff carries it. Isolation, reconciliation/dialogue, and synthesis are **not frame's** — frame supplies only the lenses, their substrate needs, the per-perspective directive, and the channel-need. The cross-lens apparatus — isolating each perspective so it forms its assessment without seeing the others, choosing how independent perspectives reconcile (when to leave them as an independent aggregate vs. open dialogue on a tension), and integrating their results into a single situated assessment — is routed to `/conduct`, which designs the arrangement, and executed by the isolated substrate that runs the lenses. frame neither realizes isolation nor synthesizes; it nudges `/conduct` and stops.

**Handoff**: present the convergence-of-framing-evidence trace as relay text (the per-perspective contributions and, for `SubstrateCorrespondence`, each lens's `substrate_need` + `binding_hints` + channel-need and the `/conduct` nudge), then hand off `FramedInquiry` and **stop**. This is the completeness boundary — frame records the handoff and halts. frame does NOT realize isolation: the isolated execution arrangement (isolation, reconciliation/dialogue, synthesis) is `/conduct`'s to design via the nudge and the substrate's to run (an agent team, a dynamic-workflow, isolated subagents, or plan-mode). Substrate feasibility for the arrangement is the substrate's (and `/conduct`'s) to enforce, surfaced at the handoff seam, never bound by frame. frame presents no synthesized multi-perspective result — convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts.

## Rules

1. **Mission Brief confirmation**: Present the Mission Brief for confirmation via Cognitive Partnership Move (Constitution) before context gathering (Phase 0 → Phase 1) — Mission Brief confirmation only, no mode question. When `user_invoked ∧ explicit_arg(U)` (e.g. `/frame "text"`), the Phase 0 MB_from_arg Extension entry applies per TOOL GROUNDING (the authoritative axis): the MB constructed from the provided text is presented as relay text and proceeds with the `J_mb=confirm` default — Phase 2 lens selection remains the downstream Constitution correction opportunity.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding.
3. **Lens-formation tool, not arranger or executor (core invariant)**: frame forms the analysis object (the lens) plus its substrate need + channel need, nudges `/conduct`, hands the framed object off, and stops. frame does NOT elicit a topology and does NOT realize isolation (arrangement is `/conduct`'s functor); it does NOT execute the inquiry (spawn, isolated analysis, reconcile, synthesize belong to the substrate). The isolation/reconciliation/synthesis apparatus is `/conduct`'s to design (reached via the nudge that accompanies every `SubstrateCorrespondence` handoff) and the isolated substrate's to run — frame compiles no such directive. This is the Epistemic Completeness Boundary: frame's epistemic contribution is forming the object and declaring its substrate need; isolation, arrangement, execution, and synthesis are delegated.
4. **Substrate-invariance (declare the need, never bind the agent)**: frame computes a per-lens `substrate_need` (authoritative abstract persona/capability) and `binding_hints` (advisory, enumerated candidate substrates — prefer skill-bundled agents). The need is authoritative; the hints are advisory and the host may bind otherwise. frame NEVER binds a concrete agent — substrate-invariance holds. The hint list exists because, absent a skill-bundled agent, hosts default to `general-purpose` and miss specialized substrates; the enumerated hints make specialized binding happen without violating invariance.
5. **No inline synthesis (core invariant)**: frame never synthesizes a multi-perspective result in its own context; convergence/synthesis is claimable only by an isolated substrate that ran the lenses. The synthesis and reconciliation machinery is NOT frame's — it is `/conduct`'s, reached by the nudge that accompanies every `SubstrateCorrespondence` handoff and run by the isolated substrate. frame compiles no synthesis directive; it forms lenses and hands them off. A single lens returns directly (`LensReturn`) with no synthesis and no convergence claim.
6. **Independence-before-contamination (routed to `/conduct`, not compiled by frame)**: each perspective should form its assessment without seeing the others until reconciliation. frame does NOT compile this requirement and does NOT realize the isolation — the `SubstrateCorrespondence` handoff nudges `/conduct`, which arranges the isolation (default `isolated`; any relaxation to `shared` is the arrangement functor's to design and record), and the substrate enforces it at execution time. The principle stays visible at the handoff seam, attributed to `/conduct` and the substrate. `LensReturn` is exempt — it ships a lens, no isolated execution.
7. **Verbatim transmission**: The per-perspective directive carries the original question unchanged; the substrate passes it to each perspective verbatim.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. All analytical context belongs in the pre-gate text.
9. **Convergence evidence**: Present the transformation trace before handoff (detailed lens(es) via `LensReturn`, or lens↔substrate pairs via `SubstrateCorrespondence`); per-perspective contribution is the required evidence. The trace demonstrates convergence-of-framing only — never a synthesized convergence of the inquiry's findings, which frame does not produce. The trace is relay (presented, then proceed) — there is no post-handoff sufficiency gate, because frame does not execute and has nothing to iterate.
10. **Zero-result surfacing**: If Phase 2 generation yields no candidate frameworks (Z: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅), present the finding with reasoning. Responses route to existing paths — modify the Mission Brief (re-present Q1, re-gather), supply perspectives directly (enter as Pᵦ), or exit (terminate, nothing compiled); no FramedInquiry is emitted from this branch.
11. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option (the Phase 2 lens options) must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
12. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text or convergence traces.
15. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

## Adversarial Guards

- **false-convergence** (a.k.a. **inline-synthesis-creep**): frame forms all the selected lenses, then reasons through every perspective *inside its own single context* and presents the result as a multi-perspective "convergence" or "synthesis." This is the bug this protocol exists to kill: one context produced all the lenses, so the agreement is structurally guaranteed — bias dressed up as multi-perspective consensus. Concretely: a single session reasons "from the security lens X, from the cost lens Y, from the UX lens Z — these converge on W" without ever running each lens in a separate isolated context. Guard: frame NEVER synthesizes a multi-perspective result in its own context AND never realizes isolation — it does not even carry the synthesis machinery (that apparatus is `/conduct`'s, reached via the nudge). With ≥2 lenses where at least one carries a specialized substrate need, frame emits `SubstrateCorrespondence` (lens↔substrate pairs) with the `/conduct` nudge and stops — convergence/synthesis is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts. A single lens returns as `LensReturn` with no convergence claim. Any "convergence"/"synthesis"/"the perspectives agree" sentence authored in frame's own context is the failure.
- **arranger-creep**: frame slides into eliciting a deliberation topology (an axis-by-axis arrangement of the perspectives) or realizing isolation itself, instead of nudging `/conduct`. Guard: frame carries no arrangement and no isolation/reconciliation/synthesis directive — the whole apparatus (isolation, independence, dialogue, dependency ordering, synthesis) is `/conduct`'s, routed by the nudge that accompanies every `SubstrateCorrespondence` handoff. Eliciting a topology or realizing isolation inside frame is the failure.
- **executor-creep**: frame begins executing the inquiry — creating a team, spawning perspectives, awaiting completion, isolating, synthesizing — instead of handing the framed object off. Guard: frame stops at handoff; isolation, execution, and synthesis belong to the substrate (and `/conduct` designs the arrangement) — Epistemic Completeness Boundary. The deliverable is the framed object (detailed lens(es) or lens↔substrate pairs ⊕ `/conduct` nudge), not a synthesis.
- **binding-overreach**: frame binds a concrete agent instead of declaring the abstract `substrate_need`, or presents `binding_hints` as mandatory rather than advisory. Guard: `substrate_need` is authoritative but abstract (persona/capability, no concrete agent); `binding_hints` is an advisory shortlist the host may override. frame names the need and suggests candidates — it never binds the agent. Substrate-invariance is the invariant.
- **lens-redundancy**: proposed perspectives collapse to variations of one framing, so the option set offers no productive tension. Guard: each lens must offer a distinct epistemic framework; surface the redundancy as an epistemic signal and re-propose with genuine tension rather than padding the option space.

## Known Limitations

**Substrate execution out of scope**: The framed object's realization — isolation fidelity, dialogue mechanics, synthesis quality — depends on the executing substrate's capabilities and the arrangement `/conduct` designs. frame surfaces the per-lens `substrate_need` + `binding_hints`, the per-perspective channel-need, and the `/conduct` nudge as handoff annotations, but does not enforce realizability and does not realize isolation; when a substrate cannot realize the arrangement (e.g. plan-mode cannot host a dialectical arrangement with no persistent addressable peers), the substrate — or `/conduct` at arrangement time — declares the degradation. This is a non-epistemic substrate boundary: frame's contract ends at the handoff. Isolation is `/conduct`'s to arrange and the substrate's to enforce; frame neither compiles nor verifies it. When `/conduct` designs the arrangement, it owns the isolation/reconciliation/synthesis apparatus and supplements the per-perspective directive with the arrangement's peer mechanics before the substrate briefs perspectives — frame supplies only the per-lens output contract, not the cross-lens machinery.

**Binding hints are advisory, not a registry**: `binding_hints` is frame's best enumerated guess at candidate substrates (preferring skill-bundled agents); it is not an authoritative agent registry and may name a substrate the host lacks or omit one the host has. The host binds against its actual available agents, using the hints to avoid the `general-purpose` default — the authoritative contract is the abstract `substrate_need`, not any concrete hint.

**SubstrateCorrespondence handoff completes the morphism, not the inquiry**: `FramedInquiry` is emitted at handoff — the framing-layer deficit (`FrameworkAbsent`) is resolved by the framed object, while the object-level inquiry remains open until the isolated substrate executes it. An unexecuted handoff is a completed frame morphism and an unrealized inquiry, by design (the same layering as `LensReturn` partial resolution below).

**LensReturn partial resolution**: `LensReturn` ships a lens (or lenses with no specialized substrate), not a resolved inquiry. `FrameworkAbsent` is addressed at the framing layer, but domain-specific resolution requires a downstream protocol or the user applying the lens. There is no inline synthesis even when multiple lenses return this way — frame ran none of them in isolation, so it makes no convergence claim.
