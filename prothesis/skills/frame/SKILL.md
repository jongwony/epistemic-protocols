---
name: frame
description: "Multi-perspective framing — a pure lens-formation tool. When the right framework is absent, places analytical lenses before the user, then for each selected lens declares the substrate it needs (an abstract persona/capability) with advisory binding hints and a channel need, and hands lens↔substrate pairs off — without executing, isolating, arranging, or synthesizing. A single lens returns directly; multiple lenses where at least one needs a specialized substrate become a substrate-correspondence handoff that nudges /conduct for the isolation + arrangement + reconciliation + synthesis apparatus, which the isolated substrate runs. frame never synthesizes a multi-perspective result in its own context and never realizes isolation — convergence is claimable only by a substrate that ran the lenses in genuine isolation. Factual lookup or verification routes to fact-finding delegation; contested design, value, interpretation, or scope judgment routes to lens-conditioned inquiry. Type: (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user for lens selection, then for each selected lens computing the substrate it needs and handing the lens↔substrate pairs off — without arranging, isolating, executing, or synthesizing. Type: `(FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition, then for each selected lens computing the **substrate** that lens needs — an authoritative `substrate_need` (the abstract persona/capability) plus advisory `binding_hints` (an enumerated candidate shortlist) — and handing the framed object off. The framed object is a detailed lens (when a single lens, or no specialized substrate beyond general-purpose is needed → `LensReturn`) or a set of lens↔substrate pairs (when ≥2 lenses are present and at least one carries a specialized substrate need → `SubstrateCorrespondence`). frame is the **lens-formation tool**: it yields the analysis object (the lens) and its substrate need + channel need, nudges `/conduct` for the isolation + arrangement + synthesis apparatus, and stops at handoff. Isolating the perspectives, arranging them — the order, independence, reconciliation, termination, and routing — and integrating their results is `/conduct`'s to design (reached via the nudge) and the substrate's to execute (spawn, isolated analysis, reconcile, synthesize). frame neither realizes isolation nor synthesizes a multi-perspective result in its own context: convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts.

```
── FLOW ──
Prothesis(U) → Q1(MB(U)) → J_mb → [confirm: MBᵥ | modify(field): MB' → re-present Q1(MB') → J_mb (loop until confirm)] → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
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
  → handoff(framed_inquiry)             -- emit the framed object (detailed lens(es), or lens↔substrate pairs ⊕ /conduct nudge), then STOP — frame does NOT realize isolation, arrange, execute, or synthesize; the isolation + arrangement + synthesis apparatus is /conduct's to design (via the nudge) and the isolated substrate's to run
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
Z      = ZeroCandidate: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅   -- Phase 2 guard: no candidate frameworks to place; surfaced as a finding (Constitution); responses: modify(field) (the J_mb constructor) | supply(Pᵦ') (perspective supply, typed via Pᵦ enrichment) — no FramedInquiry is emitted from this branch
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
        -- coproduct discriminated by SUBSTRATE SPECIALIZATION NEED (NOT a user-chosen mode): inj₁ → LensReturn (detailed lens(es) returned, no isolation handoff); inj₂ → SubstrateCorrespondence (lens↔substrate pairs handed off ⊕ /conduct nudge). NEITHER is executed by frame; isolation/convergence/synthesis is claimable only by a substrate that ran the lenses in genuine isolation, which frame neither performs nor asserts. FramedInquiry itself carries lenses and substrate pairs, never direction candidates — any direction alternatives that later become recognizable emerge downstream, from lens work executed on the framed inquiry, never from frame's own output.
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
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]; single lens is valid; on Z (zero candidates) surface the finding → Stop → route per LOOP (modify | Pᵦ' supply)
Phase 3:  LensEstablished → bind_substrate(Pₛ) → discriminate(substrate_specialization_need) → [single lens ∨ no specialized substrate: LensReturn | ≥2 lenses with at least one specialized substrate need: SubstrateCorrespondence(lens↔substrate pairs) ⊕ nudge(ConductRef)] → converge(transformation trace) → handoff(FramedInquiry) → STOP  -- bind each lens's substrate, discriminate by substrate specialization need, emit the framed object as the terminal relay with the /conduct nudge, then halt (no gate, no dispatch, NO isolation, NO synthesis; isolation + arrangement + synthesis is /conduct's to design and the isolated substrate's to run downstream)

── LOOP ──
After Phase 0 (Mission Brief confirmation only):
  J_mb = Q1 result; MBᵥ derived on confirm → Phase 1 → Phase 2 → LensEstablished → Phase 3 (bind_substrate → discriminate → handoff) → terminate
  J_mb = confirm       → proceed to Phase 1 with MBᵥ
  J_mb = modify(field) → re-present Q1(MB') → Stop → J_mb (loop until confirm derives MBᵥ)

During Phase 2 (Perspective Placement):
  Z ({P₁...Pₙ} = ∅ ∧ Pᵦ = ∅) → present the zero-result finding with reasoning → Stop:
    modify(field) → re-present Q1(MB') → Stop → J_mb (loop until confirm derives MBᵥ) → re-enter Phase 1 (re-gather) → Phase 2
    supply(Pᵦ')   → Pᵦ := Pᵦ' (auto-included) → re-present Sc with ≥ 1 novel proposal
  -- a single selected lens is valid (→ LensReturn); no two-lens minimum and no under-minimum recovery (there is no mode to satisfy)
  -- no FramedInquiry is emitted from Z; the result equation is unchanged (FramedInquiry requires LensEstablished)

During Phase 3 (Bind Substrate & Handoff):
  bind_substrate(Pₛ) → for each pᵢ ∈ Pₛ compute ⟨substrate_needᵢ (authoritative abstract persona/capability), binding_hintsᵢ (advisory enumerated candidate shortlist; PREFER skill-bundled agents), channel_needᵢ⟩ → never bind a concrete agent
  discriminate(substrate_specialization_need):
    single lens (|Pₛ| = 1) ∨ no specialized substrate beyond general-purpose → package the detailed lens(es): emit FramedInquiry = inj₁(LensReturn), hand off, terminate. NO synthesis, NO convergence claim, NO isolated handoff.
    ≥2 lenses with at least one specialized substrate need → pair each lens with ⟨substrate_need + binding_hints + per-perspective directive + channel-need⟩ → emit FramedInquiry = inj₂(SubstrateCorrespondence) with the /conduct nudge (ConductRef), hand off the lens↔substrate pairs, terminate. frame does NOT realize isolation, arrange, execute, or synthesize.
  -- handoff is the completeness boundary: frame records the handoff and halts. frame does NOT realize isolation — the isolated execution arrangement (isolation, reconciliation/dialogue, synthesis) is /conduct's to design (the /conduct nudge accompanies every SubstrateCorrespondence handoff) and the substrate's to run (an agent team, a dynamic-workflow, isolated subagents, or plan-mode). Convergence is claimable only by the isolated substrate that ran the lenses, which frame neither performs nor asserts.

Continue until convergence: FramedInquiry handed off (detailed lens(es) via LensReturn, or lens↔substrate pairs via SubstrateCorrespondence).

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
Phase 0 Q1 (constitution)        → present (Mission Brief confirmation ONLY — no mode question; when no explicit_arg)
G (observe)                      → artifact read, artifact search (meta-scope context acquisition guided by MBᵥ to identify relevant perspectives; not passed to the substrate — each perspective independently collects object-scope evidence through its own lens at execution time)
Sc (constitution)                → present (mandatory; multiSelect: true; lens selection is epistemic choice; single lens valid)
Phase 2 Z zero_result (constitution) → present (zero-candidate finding + reasoning; responses: modify(field) | supply(Pᵦ') → Pᵦ enrichment)
Phase 3 bind_substrate (sense)   → Internal operation (per-lens substrate_need (authoritative abstract persona/capability) + binding_hints (advisory candidate shortlist; PREFER skill-bundled agents) + channel_need; relay — no external tool, no user judgment beyond Pₛ; frame declares the NEED, never binds a concrete agent)
Phase 3 discriminate (sense)     → Internal operation (coproduct by substrate specialization need: single lens ∨ no specialized substrate → LensReturn = inj₁ FramedInquiry; ≥2 lenses with at least one specialized substrate need → SubstrateCorrespondence (lens↔substrate pairs ⊕ per-perspective directive ⊕ channel-need) with the /conduct nudge = inj₂ FramedInquiry)
Phase 3 converge (extension)     → TextPresent+Proceed (convergence-of-framing evidence trace: per-perspective contribution; SubstrateCorrespondence additionally surfaces each lens's substrate_need + binding_hints + channel-need + the /conduct nudge; NO synthesis of findings, NO isolation realized)
Phase 3 handoff (extension)      → TextPresent+STOP (emit the FramedInquiry — detailed lens(es) or lens↔substrate pairs ⊕ /conduct nudge — as the terminal relay, then halt; frame does NOT realize isolation, arrange, execute, or synthesize — it does NOT spawn or call delegate. The isolation + arrangement + synthesis apparatus is /conduct's to design (via the nudge) and the substrate's to run; when the substrate is the main session (the default) it consumes the framed object, when isolated executors are elected that dispatch is the substrate's action, not frame's morphism)
Λ (track)                        → Internal state update (the problem-to-solve and the framing shifts are what LEAVES this protocol: they ride in the FramedInquiry the Phase 3 handoff emits, and per-phase bookkeeping stays in session and does not leave at all. No separate durable entry is written here — it would be a second copy of what the handoff already carries, and a copy can drift from the thing it copies while still reading as authoritative)
seam (extension)                 → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the ConductRef nudge accompanying a SubstrateCorrespondence handoff — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)
-- Substrate realization: the framed object is substrate-invariant; an agent-team, a dynamic-workflow, isolated subagents, and plan-mode are PEER substrates that may execute it (the main session is a peer substrate only as an orchestrator that elects isolated executors, never isolating the lenses inline in its own context) — the substrate (or /conduct at arrangement time) owns the concrete execution tools and realizes isolation, not frame. frame declares the per-lens substrate_need (authoritative) and surfaces binding_hints (advisory candidate substrates), the per-perspective channel-need, and the /conduct nudge as handoff annotations — it NEVER binds a concrete agent and NEVER realizes isolation. Isolation + arrangement + reconciliation + synthesis is /conduct's to design (via the nudge) and the substrate's to run. Topology→substrate feasibility (e.g. a dialectical arrangement requires persistent addressable peers; an independent-aggregate ⨾ adversarial pass over a static aggregate is realizable by a stateless pipeline) is the substrate's to enforce — surfaced by /conduct at arrangement time and by the substrate at execution time, never bound by frame. The (constitution)/(extension) markers above are the authoritative axis.

── CATEGORICAL NOTE ──
frame forms analysis OBJECTS (lenses) plus each object's substrate NEED; /conduct is the ARRANGEMENT FUNCTOR over objects, generic in object type (objects = perspectives → multi-lens inquiry arrangement; objects = protocols → protocol-chain arrangement — the same functor, the same topology algebra). frame's framed object is a detailed lens (LensReturn) or lens↔substrate pairs (SubstrateCorrespondence), never an arrangement: the arrangement — together with the isolation and synthesis it governs — is the functor's action, attributed to /conduct and reached via the ConductRef nudge that accompanies every SubstrateCorrespondence handoff. frame binds the lens to the substrate it NEEDS (authoritative) with advisory binding_hints, but never to a concrete agent — substrate-invariance holds. Isolation and synthesis are NOT frame's: convergence/divergence/synthesis-basis are produced by an isolated substrate that ran the lenses (under the arrangement /conduct designs), never realized or asserted inside frame's own context — that belongs to the executed layer, outside frame's verification scope by design.

── MODE STATE ──
Λ = { phase: Phase, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), lens_pairs: Option({LensPair}), framed_output: Option(FramedInquiry), active: Bool }
Phase ∈ {0, 1, 2, 3}
-- no mode field (frame has no user-chosen mode): the framed output is discriminated at Phase 3 by substrate specialization need (LensReturn vs SubstrateCorrespondence), not by a Phase 0 choice. The section name is the cross-protocol structural-state slot, not a "mode" toggle.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

**Pre-activation routing**: Before accepting a `/frame` invocation, check the task shape. When the task is primarily finding or verifying facts, suggest fact-finding delegation instead; engage `/frame` when reasonable people could weigh contested design, value, interpretation, or scope differently and the work needs lens-conditioned evidence. This guard precedes activation — it decides whether to accept the invocation, not how the protocol behaves once active.

Direct invocation remains available. AI-guided activation applies when the purpose is present, the approach is unspecified, and multiple valid frameworks are detectable. Consult `references/conceptual-foundations.md` for the per-message trigger/skip heuristics and activation edge cases.

## Protocol

### User-facing realization

Render a Mission Brief with **Intent**, **Deliverable**, and **Scope**. For each lens option, give its discipline or framework and its distinctive analytical contribution in one line.

Candidate lenses must offer distinct epistemic frameworks, preserve productive tension, share at least one referent or standard that makes downstream comparison possible, and remain relevant to the expected deliverable. A critical lens belongs only where a genuine alternative exists. If the initial field is redundant, infer revisable epistemic axes and regenerate across them.

When the user supplies base perspectives, state them before the gate and offer only novel lenses there. Offer at least one novel lens rather than merely replaying the supplied field.

The per-perspective directive uses this stable shape:

```
You are a **[Perspective] Expert**. Analyze from this epistemic standpoint.

**Mission Brief**: Intent / Deliverable / Scope / Tool authorizations
**Orientation**: minimal MBᵥ-derived terms, directories, or domain anchors
**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: what this lens uniquely reveals
2. **Framework Analysis**: domain-specific concepts and reasoning
3. **Horizon Limits**: what this perspective cannot see or undervalues
4. **Assessment**: a direct answer aligned with the expected deliverable

Ground every table cell, list item, and comparison point in substantive evidence.
```

## Rules

- **Perspective quality**: Present each option as one discipline- or framework-named lens with a distinct contribution. Preserve productive tension and a shared comparison basis; align every lens with the expected deliverable.
- **Novelty against supplied lenses**: Treat user-supplied lenses as pre-confirmed, show them before the gate, and offer novel additions rather than repackaging them.
- **Round composition**: Use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before the gate. Read `references/round-composition.md` when terminology, verbatim wording, deferred material, or phase order binds the rendering.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.

## Adversarial Guards

- **false-convergence**: Treat an agreement or synthesis authored by the framing context itself as failure evidence; genuine cross-lens convergence requires the isolated executions the handoff routes onward.
- **lens-redundancy**: Treat lenses that differ only in wording as a failed candidate field; regenerate across distinct epistemic frameworks instead of padding the option set.
