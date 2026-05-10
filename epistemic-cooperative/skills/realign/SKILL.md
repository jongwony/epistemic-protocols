---
name: realign
description: "Project guide direction line via three-horizon fusion. Invoke with /realign."
user_invocable: true
---

# Realign Skill

Project Direction Horizon Fusion — when the user wants the project guide's direction line to remain a faithful fusion of (i) what is currently inscribed, (ii) what externally surfaced direction signals jointly testify, and (iii) what the user presently pre-understands the project to be doing, scan and elicit each horizon, propose a fused candidate with a per-horizon transformation trace, shape the candidate through dialectical exchange, and write the confirmed line back to the project guide. Type: `(HorizonsUnfused, AI, INDUCE-with-fusion, ThreeHorizons) → FusedDirection`.

Invoke directly with `/realign` when the project guide's current direction line no longer fuses with the external work landscape and the user's present sense of the project.

## Definition

**Realign** (Periagoge specialization, "fusing horizons"): A dialogical act of resolving the unfusion of three horizons — the project guide's currently inscribed direction, externally surfaced direction signals from configured channels, and the user's present pre-understanding — into a single recognized direction line, where AI scans the inscribed direction and the configured channels, elicits the user's pre-understanding as a separate horizon (not as an attribute list of the channel signals), composes a fusion candidate with a per-horizon trace marking what was preserved, what was transformed, and what was dropped in each horizon, shapes the candidate through dialectical moves, and inscribes the confirmed line back to the project guide. Direction mutation belongs to the user's per-step verdict and final confirmation acts.

This skill is a Periagoge family extension. Generic Periagoge (`/induce`) crystallizes an unnamed essence from an instance set into a session-text abstraction. Realign narrows the instance axis to *three named horizons* (each independently surfaced) and extends the output axis with a fusion trace plus a writable project-guide line update. The dialectical triangulation core is preserved (Phase 2 candidate shaping realizes the same widen / narrow / fuse / reorient / confirm / dismiss vocabulary as `/induce`), but the pre-shaping step adds a verifiable per-horizon fusion trace and the post-confirmation step adds a write that crosses the `preserves`/`mutates` boundary that `/induce` itself respects.

**Horizon-fusion discipline**: An additive paste that appends the user's pre-understanding to the inscribed direction line as a clause is not horizon fusion — it is an addendum. Fusion requires that any of the three horizons may be transformed or dropped in service of the fused candidate; the per-horizon trace surfaces this explicitly so the user can verify that no horizon was preserved by silent default. The constraint applies symmetrically: the inscribed line is not privileged over the external signals or the user's pre-understanding, and vice versa.

**Pre-understanding elicitation discipline**: The user's pre-understanding is a separate horizon, not a derivation from the surfaced channel signals. Phase 1's pre-understanding sub-step elicits the user's present sense of the project as a free utterance before the channel-derived fusion candidate is composed; conflating the channel attribute list with the user's pre-understanding collapses two horizons into one and produces a fused candidate that fails the symmetry condition above.

**Self-referential consistency**: When the project guide whose direction line is the write target prescribes principles that this skill's prose should also follow (for example, the project-agnostic discipline of this skill's vocabulary), the skill's own SKILL.md must satisfy those principles. This is not a chicken-and-egg paradox but a fixed point: the user's act of confirming the fused candidate is what guarantees the consistency between the candidate and the principles it is expected to satisfy.

## When to Use

Invoke this skill when:
- The project guide's direction line was inscribed at an earlier point and the externally surfaced work landscape has shifted since
- The user senses the inscribed direction no longer captures what the project is actually doing across open work, recent reviews, and current sessions
- The user wants the inscribed direction line to be re-derived from the three horizons rather than edited piecemeal
- A direction-fusion artifact (the per-horizon trace) is needed alongside the new line for downstream review

Skip when:
- The deficit is forward-looking deficit-recognition fit review (use `/probe`)
- The audit target is a calibration profile rather than the project guide direction line (use `/steer`)
- The user wants in-conversation abstraction crystallization without project-guide line inscription (use `/induce` directly)

## Distinction from Adjacent Skills

| Skill | Subject | Operation | Output | Persistence |
|-------|---------|-----------|--------|-------------|
| `/probe` | Deficit recognition fit review | RECOGNIZE | ProtocolRoute or FitReviewNote | Session text |
| `/induce` | Abstraction crystallization | INDUCE | CrystallizedAbstraction | Session text |
| `/steer` | Calibration profile recalibration | INDUCE-with-inscription | UpdatedProjectProfile | Project profile rule file |
| `/realign` | Three-horizon fusion of project guide direction | INDUCE-with-fusion | FusedDirection or NoFusionNote | Project guide direction line |

The skill family coexists by subject and persistence — none replaces the others. Realign is for keeping the project guide's direction line a faithful fusion of three horizons; the other skills serve forward-looking, in-conversation, or calibration-profile needs.

## Protocol

### Phase 0: Scope Determination

Determine the audit scope before scanning. Two decisions:

- **External channels** — the set of substrates whose contents are surfaced as the external-signals horizon; default set is `{ open issues, pull-request reviews including bot reviews, closed disposition trajectory, current session utterances }`; the user may add, remove, or substitute channels
- **Cross-session evidence** — default off; reading prior session direction history beyond the current session requires explicit user confirmation

If the user invocation does not specify scope, present a Constitution interaction soliciting the two decisions before proceeding to Phase 1. If scope is fully specified, accept it and proceed. The project guide path is not bound at Phase 0 — substrate discovery for Horizon A happens within Phase 1 (the inscribed-direction surfacing sub-step) so that the binding can absorb the convention-inference and ambiguity-resolution work without pre-formalization at scope time.

### Phase 1: Prejudgment — Three-Horizon Surfacing

Surface each of the three horizons independently before composing any fusion candidate.

**Horizon A — inscribed direction**: Search the project's substrate for the inscribed direction. Convention-inferred candidate guides (for example, `CLAUDE.md`, `AGENTS.md`, `README.md` at the project root); within each candidate, enumerated marker headers (for example, `Northstar`, `Mission`, `Vision`, `Direction`, `Statement of Intent`) plus an Emergent slot for project-specific markers. If a single candidate × marker pair is found, present it as Horizon A. If multiple candidates or markers are found, present them as a Constitution interaction so the user constitutes which pair is Horizon A (and therefore the Phase 3 write target). If nothing is found, Horizon A is empty — the fusion still proceeds with Horizons B and C, and the user is invited to designate a path × marker for the Phase 3 write target during Phase 2 shaping or Phase 3 approval. The `--guide=<path>` invocation argument, when supplied, overrides convention-inference and binds Horizon A directly to the given path; the marker is then either auto-detected within the file or supplied by `--direction-marker=<header>`.

**Horizon B — external-signals direction**: Scan the configured channels and aggregate the direction-bearing signals; the aggregation is a structured summary, not a fusion candidate.

**Horizon C — user pre-understanding**: Elicit the user's present pre-understanding of the project's direction as a free utterance. This sub-step is a separate Constitution interaction; it precedes any fusion candidate so the user's pre-understanding is recorded independently of the channel-derived summary. The interaction makes explicit that an attribute list of the channel signals is not a substitute — what is requested is the user's own present sense of the project.

After all three horizons are surfaced, compose a fusion candidate and a per-horizon transformation trace. The trace marks, for each horizon, which content was preserved into the candidate, which content was transformed, and which content was dropped. Each entry cites the originating horizon excerpt so the user can verify the trace is faithful.

Phase 1 emits the surfaced horizons and the candidate-with-trace as text output. The candidate becomes the input to Phase 2.

### Phase 2: Dialectical Shaping — Widen / Narrow / Fuse / Reorient / Confirm / Dismiss

Present the candidate-with-trace and propose AI verdict before yielding turn for user constitution:

`AI proposed move: <Confirm | Widen(axis) | Narrow(axis) | Fuse(adjacent) | Reorient(axis) | Dismiss>` — one-paragraph justification: which horizon contributions the candidate balances, which were transformed under the proposal, and why the proposal dominates alternatives at this step.

Then present the dialectical Constitution interaction:

```
How does the fused candidate need to be shaped?

Options:
1. Confirm — the candidate fuses the three horizons faithfully; carry forward to Phase 3 integration
2. Widen(axis) — broaden the candidate along the named axis; specify the axis
3. Narrow(axis) — restrict the candidate along the named axis; specify the axis
4. Fuse(adjacent) — fuse with an adjacent abstraction; specify the adjacent reference
5. Reorient(axis) — turn the candidate onto an orthogonal axis; specify the new axis
6. Dismiss — the candidate is not a faithful fusion; exit without write
```

Each shaping move regenerates the candidate-with-trace and re-presents Phase 2. The loop continues until V = Confirm or V = Dismiss or attempt cap is reached.

### Phase 3: Integration — Inscribe the Fused Line

When V = Confirm, present the final fused line and the per-horizon trace for user approval:

```
Fused direction line:
  <fused_line>

Per-horizon trace:
  Horizon A (inscribed direction): <preserved | transformed | dropped excerpts>
  Horizon B (external signals):    <preserved | transformed | dropped excerpts>
  Horizon C (user pre-understanding): <preserved | transformed | dropped excerpts>

Write target: <project_guide_path> (single direction line)
Rollback: git revert / git checkout
```

Then propose AI disposition before yielding turn for user constitution: `AI proposed disposition: <Approve | Modify | Reject | Defer>` — one-paragraph rationale referencing the trace, write target, and rollback path.

Then present the final approval Constitution interaction:

```
How would you like to proceed with the fused line?

Options:
1. Approve — write the fused line to <write_target>, replacing the existing direction line
2. Modify — adjust the fused line before write (specify how)
3. Reject — discard the fused candidate; the existing direction line remains unchanged; emit NoFusionNote
4. Defer — emit the fused line and trace as a session-text artifact without writing
```

After response:
- **Approve** — execute write to the project guide direction line; emit FusedDirection session-text artifact with the trace and the rollback path
- **Modify** — accept the user's adjustments, regenerate the candidate, re-present Phase 3
- **Reject** — emit NoFusionNote session-text artifact recording the surfaced horizons and the dismissed candidate
- **Defer** — emit the fused line and trace as paste-ready text; the project guide remains unchanged

After integration, log the disposition. The write (Approve) closes the loop — the fused line becomes the new prejudgment baseline for the next `/realign` invocation against the same project guide.

```
── FLOW ──
Realign(scope) → Phase0(scope, user_confirm) →
  scoped(scope): Bind(Horizon_A, Qc) → Surface(Horizon_A, Horizon_B) → Elicit(Horizon_C, Qc) →
    Compose(candidate, trace) → present(candidate, trace) → Qc(shape) → Stop → V →
      Confirm: Phase3
      Widen(axis) | Narrow(axis) | Fuse(adjacent) | Reorient(axis): regenerate(candidate, trace) → re-present Phase 2
      Dismiss: emit(NoFusionNote) → converge
    Phase3: present(fused_line, trace, write_target, rollback) → Qc(approve) → Stop → A →
      Approve: Write(fused_line, project_guide) → emit(FusedDirection)
      Modify(adjustments): regenerate(candidate, trace) → re-present Phase 3
      Reject: emit(NoFusionNote) → no write
      Defer: emit(FusedDirectionDraft) → no write
    converge

── MORPHISM ──
ThreeHorizons
  → resolve_scope(user_confirm)         -- Phase 0 scope determination (channels, cross_session)
  → bind(Horizon_A, user_confirm)       -- Phase 1 inscribed-direction binding (convention-inferred path × marker, disambiguated when ambiguous, empty when nothing inscribed)
  → surface(Horizon_A, Horizon_B)       -- Phase 1 inscribed direction + external-signals direction
  → elicit(Horizon_C, user)             -- Phase 1 user pre-understanding (separate Constitution interaction)
  → compose(candidate, trace)           -- Phase 1 fusion candidate + per-horizon transformation trace
  → present(candidate, V)               -- Phase 2 dialectical shaping
  → [V = Confirm: Phase 3; V = shape-move: regenerate; V = Dismiss: NoFusionNote]
  → present(fused_line, trace, A)       -- Phase 3 final approval
  → [A = Approve: write(fused_line, project_guide); else: no write]
  → emit(FusedDirection | NoFusionNote | FusedDirectionDraft)
                                         -- inscription on Approve, session text on other dispositions
  → FusedDirection | NoFusionNote | FusedDirectionDraft
requires: horizons_unfused(scope) ∧ scope_resolved(user)
deficit:  HorizonsUnfused
preserves: ProjectGuideHistory             -- read-only audit; horizons are derived
invariant: Recognition over Direction-Mutation, Fusion over Addendum
                                            -- ProjectGuideDirectionLine is mutated at Phase 3 Approve;
                                            -- mutation is gated by Phase 3 Constitution final approve;
                                            -- rollback is git operation on the project guide

── TYPES ──
Scope            = { channels: Set(Channel), cross_session: Bool }
Channel          ∈ { OpenIssues, PullRequestReviews, ClosedDispositionTrajectory, CurrentSessionUtterances } ∪ Emergent
BindingSource    ∈ { ExplicitArg, ConventionInferenceUnique, UserDisambiguation, EmptyInscription }
Horizon          ∈ { InscribedDirection, ExternalSignalsDirection, UserPreUnderstanding }
HorizonContent   = { horizon: Horizon, content: String, citations: List(String) }
HorizonRole      ∈ { Preserved, Transformed, Dropped }
TraceEntry       = { horizon: Horizon, role: HorizonRole, excerpt: String }
FusionCandidate  = { line: String, trace: List(TraceEntry) }
V                = ShapingMove ∈ { Confirm, Widen(axis), Narrow(axis), Fuse(adjacent), Reorient(axis), Dismiss }
A                = ApprovalDisposition ∈ { Approve, Modify(adjustments), Reject, Defer }
FusedDirection         = session text { fused_line, trace, write_path, rollback_hint }
NoFusionNote           = session text { surfaced_horizons, dismissed_candidate, dismiss_reason }
FusedDirectionDraft    = session text { fused_line, trace, suggested_apply_path }
Phase            ∈ {0, 1, 2, 3}

── SCOPE-BINDING ──
bind(scope) = explicit_arg ∪ defaults
Priority: explicit_arg > defaults

/realign --channels=<set>          → Scope.channels = <set>
/realign --cross-session           → Scope.cross_session = true
/realign --guide=<path>            → Optional Phase 1 Horizon_A override (binds the inscribed-direction path directly, bypassing convention-inference)
/realign --direction-marker=<hdr>  → Optional Phase 1 Horizon_A override (binds the inscribed-direction marker header within the chosen path)
/realign (alone)                   → Scope.channels = default set; Scope.cross_session = false; Horizon_A is resolved by Phase 1 convention-inference with Constitution disambiguation when ambiguous

When Phase 0 defaults are inferred, Phase 0 surfaces them in the scope-confirmation Constitution interaction so the user can override before scan begins.

── PHASE TRANSITIONS ──
Phase 0: scope_seed → resolve_defaults → Qc(scope_confirm) → Stop → Scope         -- scope determination [Tool]
Phase 1: Scope → InferGuide(convention) → Qc(horizon_a_bind) → Stop → (path, marker)  -- Horizon_A binding (skipped when --guide / --direction-marker fully specify) [Tool]
           (path, marker) → Read(path, marker) → Horizon_A                         -- inscribed direction (empty when nothing inscribed) [Tool]
           Scope → Scan(channels) → Horizon_B                                      -- external-signals direction [Tool]
           Qc(pre_understanding) → Stop → Horizon_C                                -- user pre-understanding (separate gate) [Tool]
           Compose(Horizon_A, Horizon_B, Horizon_C) → candidate, trace             -- fusion candidate + trace
Phase 2: present(candidate, trace) → Qc(shape) → Stop → V → integrate              -- dialectical shaping [Tool]
           V ∈ {Widen, Narrow, Fuse, Reorient} → regenerate(candidate, trace) → Phase 2 re-entry
           V = Dismiss → emit(NoFusionNote) → converge
           V = Confirm → Phase 3
Phase 3: present(fused_line, trace, write_target, rollback) → Qc(approve) → Stop → A  -- final Constitution interaction [Tool]
           A = Approve → Write(fused_line, project_guide) → emit(FusedDirection)
           A = Modify → regenerate(candidate, trace) → Phase 3 re-entry
           A = Reject → emit(NoFusionNote)
           A = Defer → emit(FusedDirectionDraft)

── LOOP ──
Phase 2 shaping loop max 5 iterations. Exhausted: surface assembled candidate as FusedDirectionDraft (defer) → converge.
Phase 3 Modify re-entry max 3 iterations. Exhausted: surface assembled candidate as FusedDirectionDraft (defer) → converge.
Convergence evidence: per disposition, emit one of {FusedDirection, NoFusionNote, FusedDirectionDraft}.

── CONVERGENCE ──
fused      = ∃ step ∈ history : V(step) = Confirm
approved   = A ∈ {Approve, Reject, Defer}
written    = A = Approve ∧ write_succeeded
session_text(realign) ∋ {FusedDirection | NoFusionNote | FusedDirectionDraft}

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 resolve_defaults  (sense)        → Internal analysis (default channel set assembly)
Phase 0 scope_from_arg    (extension)    → TextPresent+Proceed (when explicit_arg fully specifies scope; proceed with bound scope; Phase 3 Modify re-entry can adjust)
Phase 0 Qc                (constitution) → present (scope confirmation; when scope partially or fully inferred)
Phase 1 InferGuide        (sense)        → Internal analysis (convention-inferred guide candidate set × enumerated direction markers + Emergent slot)
Phase 1 Qc                (constitution) → present (Horizon A binding; constitutive user pair selection when convention-inference returns multiple candidates × markers; relayed when convention-inference returns a unique pair or when --guide / --direction-marker fully specifies)
Phase 1 Read              (observe)      → Read (inscribed direction at the bound path × marker; empty Horizon A when nothing inscribed is acceptable input to fusion)
Phase 1 Scan              (observe)      → Read / Grep / Bash (channel substrates per channel kind: open issues, pull-request reviews, closed disposition trajectory, current session utterances)
Phase 1 Qc                (constitution) → present (user pre-understanding; constitutive user utterance; conflation with channel attribute list is the failure mode this gate is designed to prevent)
Phase 1 Compose           (sense)        → Internal analysis (fusion candidate + per-horizon transformation trace; horizons are not privileged against each other; addendum patterns are surfaced as preserved-with-no-transformation traces for user verification)
Phase 2 present           (extension)    → TextPresent+Proceed (candidate-with-trace pre-gate)
Phase 2 Qc                (constitution) → present (dialectical shaping; constitutive user verdict per shaping step; widen / narrow / fuse / reorient / confirm / dismiss vocabulary inherited from /induce)
Phase 2 integrate         (track)        → Internal Λ update (shaping-move recording; candidate regeneration on shape moves)
Phase 3 present           (extension)    → TextPresent+Proceed (fused line + trace + write target + rollback pre-gate)
Phase 3 Qc                (constitution) → present (final approval; writable side effect; user authority required)
Phase 3 Write             (transform)    → Write / Edit (fused line replaces existing direction line in project guide; Approve disposition only)
Phase 3 emit              (extension)    → TextPresent+Proceed (FusedDirection or NoFusionNote or FusedDirectionDraft, per disposition)
converge                  (extension)    → TextPresent+Proceed (convergence evidence trace)

── MODE STATE ──
Λ = { phase: Phase, scope: Scope,
      horizon_a_binding: { path: Optional(Path), marker: Optional(String), source: BindingSource },
      Horizon_A: HorizonContent, Horizon_B: HorizonContent, Horizon_C: HorizonContent,
      candidate: Optional(FusionCandidate),
      shaping_history: List<(FusionCandidate, V)>, shape_iterations: Nat, modify_iterations: Nat,
      fused_line: Optional(String), write_path: Optional(Path),
      disposition: Optional(A), active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Realign composes with `/probe` upstream when a probe disposition routes to /realign. Realign composes with `/induce` laterally when an in-conversation abstraction crystallization references the project guide direction (the crystallized abstraction may be inscribed to the direction line via a subsequent /realign invocation). graph.json edges are absent by design — Realign is a utility skill, not a 13th core protocol.
```

## Storage Reference

**Read paths**:
- Project guide: the path bound at Phase 1 Horizon A binding sub-step; the inscribed direction line at the bound marker is the single line to be read and replaced. When Horizon A is empty (no inscription found), the user designates the write-target path × marker during Phase 2 shaping or Phase 3 approval.
- External channel substrates: per channel kind, read through the appropriate substrate tool (issues / pull-request reviews / closed-disposition trajectory / current-session utterances)
- Optional cross-session evidence (opt-in only): prior session direction history is read only when Phase 0 scope binds `cross_session = true`

**Write paths**:
- Project guide: the same path bound at Phase 1 Horizon A binding sub-step (or designated by the user when Horizon A was empty); the existing direction line is replaced by the fused line, or appended when no direction line was inscribed. Rollback is performed through the project's version control (for example, `git revert` or `git checkout`); a separate timestamped backup is not created because the project guide is expected to be under version control.

## Rules

1. **User-invoked only** — Realign activates only on explicit `/realign` invocation. Layer 1/Layer 2 separation is enforced.
2. **Three horizons surfaced independently** — Horizon A (inscribed direction), Horizon B (external signals), and Horizon C (user pre-understanding) are surfaced in separate sub-steps before any fusion candidate is composed. Horizon A binding (path × marker selection) is a Constitution interaction when convention-inference returns multiple candidates × markers; relay when a unique pair is found or when invocation args fully specify. Horizon C (user pre-understanding) is a Constitution interaction so the user's free utterance is recorded as a horizon, not derived from the channel attribute list. Empty Horizon A (nothing inscribed) is acceptable input to fusion — the candidate is composed from Horizons B and C, and the Phase 3 write target is designated by the user during Phase 2 or Phase 3.
3. **Fusion over addendum** — Any of the three horizons may be transformed or dropped in service of the fused candidate. An additive paste appending one horizon's content to another's as a clause is not a fusion — the per-horizon trace surfaces this so the user can verify no horizon was preserved by silent default.
4. **Per-horizon trace mandatory** — Every fusion candidate is presented alongside a per-horizon trace marking, for each horizon, which content was preserved, transformed, or dropped, with citations to the originating horizon excerpts.
5. **Final approval required before write** — Write to the project guide direction line executes only when Phase 3 Approve is selected. Reject and Defer dispositions emit session-text artifacts only; the project guide remains at its current contents.
6. **Detection with Authority** — AI surfaces horizons, composes candidates, and proposes its own verdict (Phase 2) and disposition (Phase 3) with rationale; the user constitutes per-step shaping moves and the final approval. AI proposal IS what surfaces AI's evidence-grounded reading before user constitution — the user evaluates a concrete position rather than constituting a verdict against undifferentiated horizon data. The verdict and approval acts remain the user's exclusive territory.
7. **Recognition over Recall** — Present structured candidate-with-trace and shaping options via Cognitive Partnership Move (Constitution) and yield turn. Each shaping option carries differential implication so the post-selection state is anticipatable. The Phase 3 final approval options carry differential downstream trajectories (write executed vs no-write artifact only vs deferred manual apply).
8. **Context-Question Separation** — All horizon content, candidate text, and trace entries are presented as text output before the Constitution interaction. The interaction contains only the verdict or approval options.
9. **Convergence evidence** — Phase 3 emit produces a transformation trace: per horizon, show (horizon excerpt → role in candidate → contribution to fused line); final disposition; rollback hint when written. Per-horizon evidence is required.
10. **Self-referential consistency** — When the project guide whose direction line is the write target prescribes principles that this skill's own prose must also satisfy, consistency is guaranteed by the fixed-point property of user confirmation rather than by external derivation.

## UX Safeguards

- **Pre-gate evidence visibility** — All three horizons and the candidate-with-trace are laid out before the Constitution interaction so the user reads context before deciding (Rule 8 reinforcement; context-question separation is structural).
- **Pre-understanding elicited as utterance** — Phase 1 Horizon C is a Constitution interaction soliciting the user's free utterance, distinct from the channel-derived summary. Conflation of the two is the failure mode the gate is designed to prevent (Rule 2 reinforcement).
- **Trace as fusion verifier** — The per-horizon trace marks Preserved / Transformed / Dropped with citations so the user can verify that no horizon was preserved by silent default (Rule 4 reinforcement). An addendum candidate surfaces in the trace as one horizon Preserved with no Transformed entries from other horizons.
- **Shape loop bounded** — Phase 2 shaping loop is capped at 5 iterations; exhaustion converges with FusedDirectionDraft so the audit work is preserved as session text even when no candidate reaches Confirm.
- **Rollback through version control** — The project guide is expected to be under version control; rollback is `git revert` or `git checkout` on the direction line. The rollback hint is surfaced in the Phase 3 Constitution interaction so the user knows the rollback path before approving (Rule 5 reinforcement).
- **Defer disposition as escape hatch** — When the user is unsure about writing, the Defer option emits the fused line and trace as a session-text artifact for manual application. This honors the "writable side effect needs explicit approval" principle while preserving the audit work.
