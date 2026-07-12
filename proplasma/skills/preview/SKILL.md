---
name: preview
description: "Divergent-discard instantiation before direction commitment. When direction candidates cannot be recognized from descriptions alone, materialize 2-4 placeholder probes that diverge on user-settled axes, present the per-axis contrast, and constitute the direction decision on recognition rather than simulation — probes are discarded, never evidence. Type: (DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast. Alias: Proplasma(πρόπλασμα)."
---

# Proplasma Protocol

Expose direction unknowns through divergent-discard instantiation before commitment. Type: `(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast`.

## Definition

**Proplasma** (πρόπλασμα): the preliminary clay model a sculptor shapes before committing to marble. A dialogical act for the moment right before a direction commitment when the candidate directions cannot be recognized from their descriptions: the AI derives the axes on which the candidates genuinely diverge, the user settles those axes and the placeholder policy at a spec gate, the AI instantiates two to four cheap placeholder probes that commit different values on the settled axes, presents them probe-first with a per-axis contrast, and the user constitutes the direction decision on recognized futures. Probes are discard-committed instruments — never evidence, never promoted.

```
── FLOW ──
Proplasma(X) → detect(X, route) →
  [futures recognizable from text] no_deficit_relay → exit (regular gate suffices; not activated)
  [route ∈ {①, ②, ③}] route_away_relay(matched row) → exit (routed; not activated)
  derive_axes(X) → Axs → draft_policy → Qspec → S →
  [S = Adjust(revision)] revise → Qspec (re-present; still pre-generation)
  [S = Approve] instantiate(∥ probes, temp-isolated, cleanup-registered, |P| ∈ 2..4) →
  contrast(P, Axs) → (CM, EU, CC) → present(probe-first: probes → contrast map → unknowns) →
  Qdir → D →
  [D = Select(direction)] harvest → cleanup_verify → DirectionalContrast
  [D = Synthesize(composition)] Qmicro → Gs →
    [Gs = Confirm] harvest(synthesized direction) → cleanup_verify → DirectionalContrast
    [Gs = Materialize ∧ refan_budget > 0] refan(composition) → contrast → present → Qdir
    [Gs = Materialize ∧ refan_budget = 0] budget_exhausted_relay → Qdir (re-present; Confirm/Select/exit remain)
  [D = Interrogate(question)] answer_or_harvest(question) → Qdir (re-present)
  [contrast_insufficient ∧ refan_budget > 0] refan(gap) → contrast → present → Qdir
  [contrast_insufficient ∧ refan_budget = 0] misdiagnosis_exit → cleanup_verify → route_away(①–③)
-- refan_budget = 1 (shared): contrast-insufficiency re-fan and synthesis materialization draw from the SAME single budget
-- refan whose implication carries a NEW divergence axis inherits the spec-gate duty: the new axis is presented and settled before generation
-- cleanup_verify runs on EVERY exit path: DirectionalContrast, EarlyExit (user esc), MisdiagnosisExit

── MORPHISM ──
DirectionProspect
  → detect                  -- deficit predicate + 4-step routing (type guards: fake_data_sufficient, placeholder_fidelity)
  → derive_axes             -- divergence axis candidates (where the candidate directions must commit different values)
  → set_placeholder_policy  -- visible synthesis + non-evidence stamp + skeleton-faithful/data-fake split (draft)
  → gate_spec               -- Constitution spec gate: axes + policy + probe count + realization tier settled BEFORE any generation
  → instantiate_probes      -- transform (∥, temp-isolated, cleanup-registered, |probes| ≥ 2)
  → contrast                -- per-axis juxtaposition → ContrastMap + ExposedUnknowns + CommonCommitments
  → present                 -- probe-first relay (probes one by one → contrast map → new unknowns)
  → constitute              -- direction gate: options point at probe-exposed futures (Select | Synthesize | Interrogate)
  → cleanup_verify          -- per-probe discard verification → discard_trace
  → DirectionalContrast
requires: pre_commit(direction) ∧ |direction_candidates(X)| ≥ 2   -- runtime checkpoint (Phase 0)
deficit:  DirectionUnrecognizable                                  -- activation precondition (Layer 1/2)
preserves: commit_target_identity(X)   -- the pending commitment itself is unchanged; probes never mutate it
invariant: Contrast over Simulation    -- direction judgment rests on recognized materialized futures, not mental simulation

── TYPES ──
X   = DirectionProspect: a direction decision immediately before commitment (input; carries direction_candidates, |candidates| ≥ 2;
        source-agnostic: design direction, architecture fork, UX shape, plan branch — any pre-commit direction choice)
        -- Input type: morphism processes X uniformly; enumeration scopes the definition, not behavioral dispatch
DirectionAxis = a declared divergence axis — a direction unknown on which the probes must commit different values
Axs = Set(DirectionAxis) settled at the spec gate (AI derives candidates; user settles — no axis is AI-selected past the gate)
DetectGuards (type guards, both required for activation):
  fake_data_sufficient : the direction contrast holds with placeholder concreta alone — no real evidence required
  placeholder_fidelity : placeholder concretization carries the differential futures on the divergence axes without distortion
PlaceholderPolicy = { visible_synthesis: artifacts are overtly placeholder (never mistakable for real data),
                      non_evidence_stamp: probes are evidence for no claim (pierces harvest and session remnants),
                      skeleton_data_split: structure/skeleton is faithful to each direction; data values are fake
                        -- operating rule for placeholder_fidelity: divergence must live in the skeleton, fake data must not blur it }
RealizationTier ∈ {Vignette, Mockup}
  -- Vignette: text-vignette probes — concrete placeholder-filled scenario narration in session text; no file artifacts
  -- Mockup: real artifacts (files) in temp isolation, optionally instantiated by parallel agents
Probe = cleanup-bound instrument { direction: String, axes_realized: Map(DirectionAxis, Value),
                                   artifact_ref: ArtifactRef, cleanup: CleanupAction }
ArtifactRef = None                      -- Vignette tier: session-text only, no file to destroy
            | Path(temp-isolated path)  -- Mockup tier: locatable file/dir under temp isolation; registered at creation
CleanupAction = the concrete destruction step for artifact_ref (no-op for None; file/dir removal for Path)
ContrastMap = per-axis juxtaposition: for each axis ∈ Axs, the futures each probe exposes on that axis
ExposedUnknown = a direction unknown newly exposed by the contrast (pre-commit check candidate; routed downstream at harvest)
CommonCommitment = a design decision forced uniformly across ALL probes during instantiation (not on a divergence axis);
                   must be reported at present so the user does not mistake a shared premise for a divergence axis
S  = Spec gate answer ∈ {Approve, Adjust(revision)}       -- Adjust revises axes/policy/count/tier and re-presents; pre-generation
D  = Direction gate answer ∈ {Select(direction), Synthesize(composition), Interrogate(question)}
       -- Select: settle one probe-exposed direction
       -- Synthesize: user composes/recombines the presented probes → opens micro-gate Gs
       -- Interrogate: user questions a probe; design-intent questions answered immediately within placeholder discipline,
       --   factual unknowns (needing real evidence) harvested as ExposedUnknown → routed to /inquire; gate re-presented
Gs = Synthesis micro-gate answer ∈ {Confirm, Materialize}
       -- Confirm: settle the synthesized direction as-is, now
       -- Materialize: re-fan the synthesis into new probes (consumes the shared re-fan budget)
       -- micro-gate exists because only the user can judge whether their synthesis is already recognized well enough
UserDecision = the constituted direction: Select's direction, or the synthesis settled via Confirm (either way user-constituted)
Disposition ∈ {FileDestroyed, NoFileArtifact, DiscardFailed(reason)}
  -- FileDestroyed: Path artifact removed and verified absent (satisfying condition for Mockup tier)
  -- NoFileArtifact: Vignette tier — nothing to destroy; discard = non-promotion, remnant text stays under the non-evidence stamp
  -- DiscardFailed: destruction attempted (with one retry) and still present; declared, never silent
DiscardTrace = List<(Probe, Disposition)>  -- one entry per instantiated probe (re-fanned probes included)
DirectionalContrast = single record {                          -- terminal; single-record codomain (no bare plural)
                        contrast_map:     ContrastMap,         --   restricted to the DECIDING rows at harvest (Rule 10)
                        exposed_unknowns: Set(ExposedUnknown), --   each tagged with its downstream route (/gap or /inquire)
                        direction:        UserDecision,
                        discard_trace:    DiscardTrace }
EarlyExit = user esc at any gate: partial transformation trace over completed steps + cleanup_verify still enforced
            + residual declared (direction NOT constituted; morphism not completed)
MisdiagnosisExit = refan_budget exhausted ∧ contrast still insufficient: deficit misdiagnosis report + cleanup_verify enforced
            + route_away handoff per the 4-step routing table (①–③); no DirectionalContrast is emitted
contrast_insufficient = the presented contrast does not make the candidate futures recognizable on the settled axes
            -- declared by the user (free response at the direction gate) or detected at contrast (an axis with no
            --   differentiated values across probes); either way it is surfaced, never silently self-repaired

── PHASE TRANSITIONS ──
Phase 0: X → detect(X) → route?                                -- deficit predicate + 4-step routing (silent analysis)
       [futures recognizable from text] no_deficit_relay → exit  -- regular gate suffices; Proplasma not activated
       [route ∈ {①, ②, ③}] route_away_relay(matched row) → exit -- cite the matched routing row; not activated
Phase 1: derive_axes(X) → Axs_candidates → draft_policy → Qspec(axes + policy + probe count + tier) → Stop → S  -- spec gate [Tool]
       [S = Adjust(revision)] revise(Λ) → re-present Qspec       -- pre-generation loop; no probe exists yet
       [S = Approve] settle(Λ.axes, Λ.policy, Λ.tier) → Phase 2
Phase 2: instantiate(∥ per direction, temp-isolated, cleanup-registered) → P  -- transform; |P| ∈ 2..4 [Tool]
       [Mockup tier, conditional] instantiate_delegate(∥ one probe per agent, temp-isolated) [Tool]
       -- forced common design decisions recorded → Λ.common_commitments
Phase 3: contrast(P, Λ.axes) → (CM, EU, CC) → present            -- probe-first order: probes one by one → contrast map
                                                                  --   (with CommonCommitments declared) → new unknowns [Tool]
       [contrast_insufficient ∧ Λ.refan_budget > 0] refan(gap) → decrement budget → Phase 2
         -- refan carrying a NEW divergence axis: present the axis and settle it before generation (spec-gate duty inherited)
       [contrast_insufficient ∧ Λ.refan_budget = 0] → Phase 5 (MisdiagnosisExit arm)
Phase 4: Qdir(probe-exposed futures) → Stop → D                   -- direction gate [Tool]
       [D = Select(direction)] Λ.direction := direction → Phase 5
       [D = Synthesize(composition)] Qmicro(composition) → Stop → Gs  -- synthesis micro-gate [Tool]
         [Gs = Confirm] Λ.direction := composition → Phase 5
         [Gs = Materialize ∧ Λ.refan_budget > 0] refan(composition) → decrement budget → Phase 2
         [Gs = Materialize ∧ Λ.refan_budget = 0] budget_exhausted_relay → re-present Qdir
       [D = Interrogate(question)]
         [design-intent] answer within placeholder discipline → re-present Qdir
         [factual unknown] harvest as ExposedUnknown (route: /inquire) → re-present Qdir
Phase 5: harvest → cleanup_verify → terminal                      -- harvest BEFORE discard [Tool]
       harvest = (direction, deciding contrast rows, inherited unknowns with routes, discard_trace)
       cleanup_verify: per probe, execute cleanup → verify absence → Disposition
         [DiscardFailed] retry once → still present → declare DiscardFailed(reason) in discard_trace (visible, never silent)
       [from Phase 4] → DirectionalContrast
       [from Phase 3 budget-exhausted arm] → MisdiagnosisExit (misdiagnosis report + route_away ①–③)
       [user esc at any gate] → EarlyExit (partial trace; cleanup_verify still runs)

── LOOP ──
Default probe count 2–4 (settled at the spec gate).
Re-fan bound: at most 1 re-fan per activation — contrast-insufficiency re-fan and synthesis materialization SHARE this
  single budget (no separate budgets). After the budget is spent, a still-insufficient contrast is treated as deficit
  misdiagnosis: report it and hand off per the Phase 0 routing table (MisdiagnosisExit), never fan again.
Interrogate and Adjust do not consume the re-fan budget (they generate no probes).
User can exit at any gate (esc): EarlyExit — cleanup_verify still runs; partial trace presented; residual declared.
Continue until: DirectionalContrast (direction constituted + discard verified) OR EarlyExit OR MisdiagnosisExit.
Convergence evidence: at terminal, present the transformation trace — each settled axis mapped to the contrast rows that
  made its futures recognizable, the constituted direction, each exposed unknown with its downstream route, and the
  per-probe discard disposition. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converged(Λ) = Λ.direction ≠ None ∧ discard_declared(Λ)
discard_declared(Λ) = ∀ p ∈ Λ.probes: (p, d) ∈ Λ.discard_trace   -- every probe has a declared Disposition
                                                                   --   (DiscardFailed is declared, not converged-silently)
result equations:
  DirectionalContrast ⇔ Λ.direction ≠ None ∧ discard_declared(Λ)
  EarlyExit           ⇔ user_esc ∧ discard_declared(Λ)             -- cleanup enforced on early exit too
  MisdiagnosisExit    ⇔ Λ.refan_budget = 0 ∧ contrast_insufficient ∧ discard_declared(Λ)
framing readout: the surfaced state names the work in play (axes being settled, probes under contrast, direction being
  constituted, discard being verified) — never a completion tally.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 detect (sense)             → Internal analysis (deficit predicate + 4-step routing; no external tool)
Phase 0 no_deficit_relay (extension) → TextPresent+Proceed (futures recognizable from text: present the finding with reasoning; regular gate suffices; not activated)
Phase 0 route_away_relay (extension) → TextPresent+Proceed (routing rows ①–③: present the matched row with its basis; hand off to the cited protocol; not activated)
Phase 1 derive_axes (sense)        → Internal analysis (divergence axis candidates from the candidate directions)
Phase 1 draft_policy (sense)       → Internal analysis (placeholder policy draft: visible synthesis, non-evidence stamp, skeleton-data split)
Phase 1 Qspec (constitution)       → present (mandatory spec gate: divergence axes + placeholder policy + probe count + realization tier; fires BEFORE any probe generation — no divergence axis is AI-selected past this gate; Adjust re-presents without generation)
Phase 1 revise (track)             → Internal state update (Adjust branch: Λ axes/policy/count/tier revision before re-presenting Qspec)
Phase 2 instantiate (transform)    → Write, Bash (temp-isolated placeholder artifacts, cleanup-registered at creation; existing project files never modified; Vignette tier emits session text only — no file artifact)
Phase 2 instantiate_delegate (dispatch) → Agent (conditional, Mockup tier; parallel topology: one probe per agent, each temp-isolated with cleanup registration; delegation subordinate to the active runtime/tool policy)
Phase 3 contrast (sense)           → Internal analysis (per-axis juxtaposition; CommonCommitment extraction)
Phase 3 present (extension)        → TextPresent+Proceed (probe-first order: probes one by one → per-axis contrast map with common commitments declared → newly exposed unknowns; table-first re-abstracts and reproduces the deficit)
Phase 4 Qdir (constitution)        → present (mandatory direction gate: each option points at the probe-exposed future it settles — recognition, not label simulation; Select | Synthesize | Interrogate)
Phase 4 Qmicro (constitution)      → present (conditional: fires on Synthesize; Confirm settles the synthesis now, Materialize re-fans it into new probes consuming the shared budget; only the user can judge whether the synthesis is already recognized)
Phase 4 interrogate_answer (extension) → TextPresent+Proceed (design-intent answers within placeholder discipline; factual unknowns harvested to ExposedUnknowns with /inquire route)
Phase 4 budget_exhausted_relay (extension) → TextPresent+Proceed (Materialize requested with the shared re-fan budget spent: state the exhaustion with its basis; re-present the direction gate — Confirm/Select/exit remain)
Phase 5 harvest (track)            → Internal state update (direction, deciding contrast rows, routed unknowns recorded before discard)
Phase 5 cleanup (transform)        → Bash (per-probe artifact destruction; retry once on failure)
Phase 5 cleanup_verify (observe)   → Bash, Read (verify absence of each Path artifact; Disposition recorded per probe)
converge (extension)               → TextPresent+Proceed (transformation trace: axes → deciding contrast rows → direction; unknowns with routes; per-probe discard disposition)
esc (extension)                    → TextPresent+Proceed (partial transformation trace + residual declaration; cleanup_verify still enforced; terminate as EarlyExit)
misdiagnosis (extension)           → TextPresent+Proceed (deficit misdiagnosis report + route_away handoff per routing table; cleanup_verify enforced; terminate as MisdiagnosisExit)

── MODE STATE ──
Λ = { phase: Phase, X: DirectionProspect,
      axes: Set(DirectionAxis),                -- settled at Qspec; extended only via inherited spec-gate duty on refan
      policy: PlaceholderPolicy, tier: RealizationTier,
      probes: List(Probe),                     -- cumulative across refan (discarded probes remain listed for the trace)
      contrast_map: Option(ContrastMap),
      exposed_unknowns: Set(ExposedUnknown),
      common_commitments: Set(CommonCommitment),
      refan_budget: ℕ,                         -- init 1; decremented by refan (insufficiency or materialization, shared)
      direction: Option(UserDecision),
      discard_trace: DiscardTrace,             -- one entry per probe by terminal (invariant: discard_declared)
      history: List<(Q, A)>,
      active: Bool, cause_tag: String }
-- Guard: no probe exists while phase < 2 (spec gate precedes all generation)
-- Guard: ∀ p ∈ probes: p.artifact_ref = None ∨ temp_isolated(p.artifact_ref) (no permanent project file, ever)
-- Guard at terminal: discard_declared(Λ) — every probe carries a declared Disposition

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Direction resolution emergent via session context.
```

## Core Principle

**Contrast over Simulation**: When the differential futures of direction candidates cannot be carried by descriptions, a structurally perfect gate still forces the user to mentally simulate consequences instead of recognizing them. Proplasma replaces simulation with materialized contrast: cheap placeholder probes commit different values on user-settled divergence axes, and the direction judgment is constituted on futures the user has actually seen.

Probe generation is a **transform operation**, legitimate only inside this survival chain: Constitution spec gate (axes + placeholder policy settled) → transform generation (temp-isolated, cleanup-registered, visibly synthetic, non-evidence) → relay contrast presentation (per-axis juxtaposition) → Constitution direction decision → cleanup verification (discard_trace). Three breach conditions dissolve the chain, and any one of them demotes the protocol to a stop-and-hand-off (no generation): (1) an AI-selected divergence axis without or after the spec gate, (2) a write to a permanent project file, (3) a probe treated as evidence for any claim. The demotion is the only permitted fallback — there is no ad-hoc bypass.

The self-cannibalization objection ("resolving a description-failure with more description") is answered by the tier structure: a vignette is not a label-description but a placeholder-**concretum** narration — a different layer. When even vignette-level materialization cannot carry the contrast, the Mockup tier builds real temp-isolated artifacts; the protocol's meaning is independent of the realization tier.

## Mode Activation

### Activation

User calls `/preview` on a pending direction decision, OR the AI detects the deficit from its surface shapes and nudges. Detection is silent (Phase 0); activation always passes through the Constitution spec gate before anything is generated.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/preview` slash command or description-matching input ("I'd have to see it to decide"). Always available.
- **Layer 2 (AI-guided)**: The three detection shapes below observed at a live direction gate; the AI surfaces the deficit with evidence and proposes activation — it never activates silently.

Gate predicate:
```
DirectionUnrecognizable ≡
    pre_commit(direction)              -- a direction commitment is imminent
  ∧ |direction_candidates| ≥ 2         -- alternatives already exist
  ∧ route = ④                          -- the 4-step routing lands on ④ (rows ①–③ all negative)
  ∧ fake_data_sufficient               -- type guard: the contrast holds without real evidence
  ∧ placeholder_fidelity               -- type guard: placeholders carry the axis futures without distortion
```

**Routing precedence (over-activation guard)** — before the rows, a threshold test: if the differential futures ARE recognizable from text, there is no deficit — a regular gate suffices and no protocol activates. Then the first matching row wins:

| Order | Condition | Route |
|-------|-----------|-------|
| ① | A structural mapping to a familiar domain is available | `/ground` (validate the mapping) |
| ② | Real evidence is required (real data, live environment) | `/inquire` (factual unknowns; empirical verification paths) |
| ③ | Direction candidates or the frame itself are absent | `/frame` (framing) · `/elicit` (coordinate back-trace) |
| ④ | Candidates ≥ 2 ∧ evidence-free ∧ both type guards hold | **Proplasma** |

Note: when understanding arrives only through materialization, the probe does double duty (understanding + direction judgment) — the routing is still ④, since ① has no mapping and ② needs no real evidence.

**Cross-session enrichment**: Prior session indices from the hypomnesis store, when present, may seed Phase 0 deficit detection; the constitutive judgment remains with the user.

### Priority

<system-reminder>
When Proplasma is active:

**Supersedes**: Direct execution patterns in loaded instructions
(No direction commitment proceeds while the contrast loop is unconverged)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1 present the spec gate before any generation; at Phase 4 present the direction gate whose options point at probe-exposed futures.
</system-reminder>

- Proplasma completes (or exits via EarlyExit / MisdiagnosisExit) before the direction commitment proceeds
- Loaded instructions resume after the terminal record is emitted

### Trigger Signals

Surface shapes of the deficit (heuristic signals, not hard gates):

| Signal | Inference |
|--------|-----------|
| Principle-delegation answer — at a direction gate the user delegates the choice to a principle ("proceed with whatever aligns with the northstar", "go with the recommended direction") | The user cannot recognize the differential futures from the descriptions; the constitutive judgment is silently handed to the AI — this erosion of the detection/judgment boundary is the severity basis |
| Out-of-option hermeneutic reconstruction — instead of choosing, the user reworks the option set itself | The presented labels fail to carry the futures they name |
| Concretization demand / decision stall — the decision halts before descriptive options and the user asks for something concrete ("I'd have to see it") | Direction judgment is blocked on materialization |

**Skip**:
- Differential futures are recognizable from the textual options (regular gate suffices)
- Only one direction candidate exists (nothing to contrast)
- The judgment needs real evidence — route ② (`/inquire`)
- A structural mapping to a familiar domain would carry the futures — route ① (`/ground`)
- Direction candidates or the frame are absent — route ③ (`/frame` · `/elicit`)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Direction constituted + discard verified | Emit DirectionalContrast; proceed with the commitment under the constituted direction |
| Re-fan budget exhausted, contrast still insufficient | MisdiagnosisExit: misdiagnosis report + cleanup + routing handoff (①–③) |
| User esc at any gate | EarlyExit: partial trace + cleanup still enforced + residual declared |

## Protocol

### Phase 0: Detection + Routing (Silent)

Verify the gate predicate and run the routing precedence. No user interaction unless a relay fires.

1. Confirm a direction commitment is imminent and at least two candidates exist
2. Threshold test: are the differential futures recognizable from text? If yes — present the finding as relay and stand down (a regular gate suffices)
3. Walk routing rows ① → ③; on a match, present the matched row with its basis as relay and hand off (not activated)
4. Verify both type guards: the contrast must hold on placeholder concreta alone (`fake_data_sufficient`), and placeholders must carry the axis futures without distortion (`placeholder_fidelity`). A guard failure is a routing signal, not a defect to push through — row ② (evidence needed) or row ③ (frame absent) usually explains it
5. All positive: proceed to Phase 1

### Phase 1: Spec Gate

Derive the divergence axes and draft the placeholder policy; the user settles both before anything is generated.

- **Derive axes**: from the candidate directions, back-trace the unknowns on which they genuinely diverge — each axis is a dimension where probes must commit different values. Surface variation (color, naming, ordering) is not divergence
- **Draft policy**: visible synthesis (artifacts overtly placeholder), non-evidence stamp (probes ground no claim), skeleton-data split (skeleton faithful to each direction, data fake — divergence lives in the skeleton, fake data must not blur it)
- **Propose probe count (2–4) and realization tier**: Vignette (session-text scenario narration; no files) or Mockup (real temp-isolated artifacts, optionally via parallel agents)

Present the axes, policy, count, and tier as pre-gate analysis text; then **present** the spec gate:

```
Settle the probe spec before I build anything.

Options:
1. **Approve** — generate the probes on these axes under this policy
2. **Adjust** — revise axes, policy, probe count, or tier; I re-present the spec (nothing is generated meanwhile)
```

This gate is the enforcement point of breach condition (1): past it, no divergence axis is ever AI-selected. A re-fan whose implication carries a new axis inherits this duty — the new axis is presented and settled before generation.

### Phase 2: Instantiation (Transform)

Generate the probes without interaction, inside the survival chain:

- One probe per candidate direction (2–4 total), each committing its own values on every settled axis
- **Temp isolation**: Mockup artifacts are created only under temp/scratch isolation and registered for cleanup at creation; existing project files are never modified (breach condition 2). Vignette probes emit session text only
- **Common commitments**: any design decision forced uniformly across all probes (a shared premise, not a divergence axis) is recorded for declaration at Phase 3 — otherwise the user may mistake it for divergence
- Every artifact is overtly synthetic per the policy; the non-evidence stamp attaches at creation

### Phase 3: Contrast Presentation (Relay)

Fixed presentation order — **probes first**:

1. Each probe, one at a time (the concretum itself: the vignette narration, or the Mockup artifact walked through)
2. The per-axis contrast map — for each settled axis, the futures each probe exposes — with common commitments explicitly declared as shared premises
3. Newly exposed unknowns

A table placed first would re-abstract the concreta back into (structured) description — reproducing inside the presentation the very deficit the protocol resolves. The map interprets the probes; it never replaces them.

If the contrast is insufficient (an axis with undifferentiated values, or the user declares it): re-fan once within the shared budget; past the budget, treat as deficit misdiagnosis and hand off per the routing table.

### Phase 4: Direction Gate (Constitution)

Present the contrast summary as pre-gate text; then **present** the direction gate. Each option's implication is a pointer to the future a probe already exposed — recognition, not label simulation:

```
Which direction do you settle?

Options:
1. **Select** — settle one of the probe-exposed directions (name it); its future is the one you saw in that probe
2. **Synthesize** — compose your own direction from the probes (recombine/adjust); opens a micro-choice: confirm it now, or materialize it as a new probe within the remaining re-fan budget
3. **Interrogate** — question a probe before deciding; design-intent questions answered on the spot within placeholder discipline, factual questions harvested for /inquire downstream
```

- **Select(direction)** → Phase 5
- **Synthesize(composition)** → **present** the micro-gate: **Confirm** (settle now) or **Materialize** (re-fan the synthesis into probes; consumes the shared budget). Only the user can judge whether their synthesis is already recognized well enough — the AI cannot measure that. With the budget exhausted, Materialize is unavailable and the gate is re-presented (Confirm / Select / exit remain)
- **Interrogate(question)** → design-intent: answer immediately, staying within placeholder discipline (no real-evidence claims); factual unknown: harvest as ExposedUnknown routed to `/inquire`, then re-present the gate

### Phase 5: Harvest → Discard (in this order)

**Harvest precedes discard.** Harvest exactly:
- (a) the constituted direction
- (b) the **deciding** contrast rows — the rows that actually contributed to the decision, not the whole map
- (c) inherited unknowns, each tagged with its downstream route — pre-commit checks to `/gap`, factual investigation to `/inquire`
- (d) the discard trace

Then **cleanup verification**, per probe: execute the registered cleanup, verify absence, record the Disposition. File destruction is the satisfying condition (Mockup); Vignette probes record NoFileArtifact — session-text remnants are permitted, and the non-evidence stamp pierces them: no remnant, and no harvested contrast row, is ever citable as evidence for any claim. A failed destruction is retried once, then declared as DiscardFailed in the trace with a manual-cleanup handoff — visible, never silent.

The durable record keeps the direction decision only; probes and their detail remain session-local and discarded. Present the convergence trace (LOOP) and emit the terminal record.

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | Activation requires the full predicate incl. route = ④ and both type guards | No activation on decisions a regular gate or a sibling protocol serves |
| Spec before generation | Phase 1 Qspec precedes Phase 2; Adjust loops without generating | User settles axes/policy; breach condition (1) enforced |
| Temp isolation | artifact_ref invariant: None or temp-isolated path; cleanup registered at creation | Breach condition (2) enforced; no permanent project file |
| Non-evidence stamp | Policy attaches at creation; pierces harvest and session remnants | Breach condition (3) enforced; probes ground no claim |
| Probe-first order | Phase 3 fixed order: probes → map → unknowns | Presentation does not re-abstract the concreta into description |
| Common-commitment declaration | Forced shared decisions declared with the contrast map | Shared premises are not mistaken for divergence axes |
| Bounded re-fan | Single shared budget (insufficiency + materialization); then misdiagnosis handoff | Bounded loop; no unbounded fan-out |
| Cleanup on every exit | cleanup_verify runs for DirectionalContrast, EarlyExit, and MisdiagnosisExit | No exit path leaks artifacts |
| Discard transparency | Per-probe Disposition in discard_trace; DiscardFailed declared with handoff | User can audit the discard; failures never silent |
| Current-work framing | Surfacing names the work in play (axes, probes, contrast, discard) | Framing readout, not a completion tally |

## Rules

1. **Hybrid initiation, user-constituted direction** (Cognitive Partnership Move): the user's utterance ("I'd have to see it") dominates activation, and the AI may nudge from the three detection shapes with cited evidence; every constitutive step — divergence axes, placeholder policy, the direction itself — is settled by the user at a Constitution gate. The AI derives, instantiates, contrasts; it never selects the direction.
2. **Recognition over Recall, on materialized futures**: direction-gate options point at futures the probes already exposed — the user recognizes, never mentally simulates from labels. Presenting label-only implications at the direction gate reproduces the deficit inside the gate.
3. **Spec gate before generation** (breach condition 1): no probe exists before the spec gate settles axes and policy; no divergence axis is AI-selected past the gate. A re-fan whose implication carries a new axis inherits the spec-gate duty for that axis.
4. **Temp isolation** (breach condition 2): probes live under temp isolation with cleanup registered at creation; existing project files are never modified. Vignette-tier probes emit session text only.
5. **Non-evidence stamp** (breach condition 3): a probe is evidence for no claim — the stamp attaches at creation and pierces the harvest record and any session-text remnant. Citing a placeholder concretum as grounds for any claim dissolves the protocol's legitimacy; if a breach becomes unavoidable by design, the only permitted fallback is demotion to stop-and-hand-off (no generation).
6. **Probe-first presentation**: probes one at a time, then the per-axis contrast map, then new unknowns. A table placed first re-abstracts the concreta and reproduces the deficit in the presentation order.
7. **Common commitments declared**: design decisions forced uniformly across probes during instantiation are reported with the contrast map, so shared premises are never mistaken for divergence axes.
8. **Direction-gate response discipline**: Select settles a probe-exposed direction; Synthesize opens the micro-gate (Confirm now vs Materialize as re-fan) because only the user can judge whether their synthesis is already recognized; Interrogate answers design-intent questions within placeholder discipline and harvests factual unknowns to `/inquire`.
9. **One shared re-fan**: contrast-insufficiency re-fan and synthesis materialization share a single re-fan; when it is spent and the contrast is still insufficient, report deficit misdiagnosis and hand off per the routing table — never fan again.
10. **Harvest before discard**: harvest the direction, the deciding contrast rows only, the routed unknowns, and the discard trace — then discard. The durable record keeps the direction decision only; probe detail stays session-local.
11. **Cleanup on every exit path**: DirectionalContrast, EarlyExit, and MisdiagnosisExit all run cleanup verification; every probe carries a declared Disposition; a failed destruction is retried once and then declared, never silent.
12. **Convergence persistence**: the mode stays active until the direction is constituted and the discard is declared, or the user exits, or misdiagnosis is declared; convergence is demonstrated via the transformation trace, not asserted.
13. **Context-Question Separation**: analysis, evidence, and the contrast presentation are text output before each gate; the gate contains the essential question and option-specific differential implications only.
14. **Option-set relay test (Extension classification)**: a single dominant option (entropy → 0) is presented as relay with cited basis. Each Constitution option must be genuinely viable under different user value weightings; shared-trajectory options collapse to one; off-axis prompts surface as free-response pathways rather than peer options.
15. **Plain emit discipline**: user-facing emit (probe narrations, contrast presentation, gate options, convergence traces) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. Formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, code-style backtick tokens — stays in the formal block. What the user reads is the probe, the contrast, or the question in their idiom.
16. **Round-local salience bundling**: each user-facing round bundles the current judgment, its nearest evidence (the relevant probe or contrast row), and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
17. **Gate integrity** (Safeguard tier): the defined option sets (S, D, Gs) are presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option into a concrete term while preserving the TYPES coproduct — e.g., naming the actual probe directions inside Select) is distinct from mutation.
18. **Formal blocks are runtime-normative**: this protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
