---
name: steer
description: "Project profile recalibration via session calibration drift audit. Scan session calibration moves for Constitution overapplication, Extension misapplication, and existing profile drift, present per-cluster evidence for user-constituted verdict, then write an updated user-global or project-local project-profile rule file via Circular Return. Use this skill whenever the user wants to 'recalibrate project profile', 'audit calibration drift', 'reinduce Cognitive Partnership Move defaults', 'steer project profile', or invokes /steer. Periagoge family — extends /induce with a writable rule inscription step for ProjectProfile. Stage 2 evidence-collection instrument."
user_invocable: true
---

# Steer Skill

Project Profile Recalibration via Calibration Drift Audit — when the user wants to refresh the user-global or project-local project-profile rule layer based on observed Cognitive Partnership Move calibration drift in a target session, scan calibration moves for Constitution overapplication, Extension misapplication, and existing-profile drift, surface per-cluster evidence for user-constituted verdict, assemble a profile diff, and write an updated rule file with timestamped backup. Type: `(CalibrationDriftOpaque, AI, INDUCE-with-inscription, SessionCalibrationMoves) → UpdatedProjectProfile`.

Invoke directly with `/steer` when the user wants the project profile to track observed calibration practice rather than remain frozen at initialization time.

## Definition

**Steer** (Periagoge specialization, "turning the helm"): A dialogical act of resolving the opacity of project profile drift into a recognized profile update, where AI scans target session calibration moves against the existing project-profile rule layer, classifies each move into drift clusters, presents per-cluster evidence for user-constituted verdict, assembles a diff over the six profile variables, and inscribes the approved diff back into the rule file — profile mutation belongs to the user's per-cluster verdict and final approval acts.

This skill is a Periagoge family extension. Generic Periagoge (`/induce`) crystallizes an unnamed essence from an instance set into a session-text abstraction. Steer narrows the instance axis to *Cognitive Partnership Move calibration moves observed in a target session* and extends the output axis with a writable rule inscription step — the inscribed `project-profile.md` becomes the new prejudgment baseline for the next invocation, making the Circular Return load-bearing across sessions. The dialectical triangulation core is preserved (Phase 3 per-cluster verdicts and Phase 5 final approval realize the Confirm / Dismiss / Reorient pattern), but the write step crosses the `preserves`/`mutates` boundary that `/induce` itself respects.

This skill stands in time-axis dual relationship to `/probe` (prospective fit recognition). Both refuse AI-side resolution and treat user recognition as the constitutive act. The writable persistence layer is what makes Steer useful for keeping the profile current as a project's needs change.

Phase 3 per-cluster recognition is verification-category — the user verifies the AI's classification accuracy of an already-detected drift cluster, not a forward-trajectory selection. The Differential Future Requirement does not apply to the per-cluster verdict gate by the same logic that exempts Anamnesis Phase 2 recognition gates (past-identity synthesis, not future-trajectory commitment): a 1-correct option structure (was-drift / was-aligned) is legitimate by purpose because downstream diff assembly is a deterministic consequence of the verdict, not a user-selected trajectory. Phase 5 final approve gate IS forward-looking (write or not write) and follows the Differential Future Requirement.

## When to Use

Invoke this skill when:
- The project profile was set at initialization but the user senses observed calibration practice has drifted from the inscribed defaults
- The user wants to refresh `~/.claude/rules/project-profile.md` (user-global) or `.claude/rules/project-profile.md` (project-local) based on a recent session's calibration moves
- The user wants empirical evidence about which Cognitive Partnership Move axes (Constitution / Extension / six profile variables) need recalibration
- A target session contains enough calibration moves (gate interactions, auto-resolutions, agent boundary actions) to support a meaningful audit

Skip when:
- The deficit is forward-looking (use `/probe` for prospective deficit recognition)
- The audit target is past protocol contract integrity rather than calibration drift in Cognitive Partnership Move
- The session contains too few calibration moves to support audit (Phase 0 deactivates with no-op note)
- The user wants in-conversation abstraction crystallization without rule inscription (use `/induce` directly)
- The user wants accumulated session analytics without profile-update focus (use `/report` or `/dashboard`)

## Distinction from Adjacent Skills

| Skill | Time axis | Subject | Operation | Output | Persistence |
|-------|-----------|---------|-----------|--------|-------------|
| `/probe` | Prospective (present situation) | Deficit recognition fit review | RECOGNIZE | ProtocolRoute or FitReviewNote | Session text |
| `/induce` | In-process (instance set) | Abstraction crystallization | INDUCE | CrystallizedAbstraction | Session text |
| `/steer` | Retrospective (target session) | Cognitive Partnership Move calibration drift | INDUCE extended with writable inscription, with routing to operational layer when finding shape mismatches | UpdatedProjectProfile, NoUpdateNote, DiffArtifact, or OperationalLayerRecommendation | Writable rule file (Approve disposition) or session text (other dispositions) |

The skill family coexists by operation and persistence — none replaces the others. Steer is for keeping the project profile current with observed practice; the other skills serve forward-looking or in-conversation needs.

## Protocol

### Phase 0: Scope Determination

Determine the audit scope before scanning. Three decisions:

- **Target session** — default is the current session only; the user may pass a session_id argument to target a different session
- **Layer** — `user_global` (`~/.claude/rules/project-profile.md`) or `project_local` (`.claude/rules/project-profile.md`); when both files exist, default to the layer the user invoked from (project_local when CWD is inside a project with a local file, user_global otherwise); the user may override
- **Cross-session evidence** — default off; reading prior session calibration history beyond the target session requires explicit user confirmation

If the user invocation does not specify scope, present a Constitution interaction soliciting the three decisions before proceeding to Phase 1. If scope is fully specified, accept it and proceed.

Phase 0 is otherwise silent. If the target session contains fewer than the minimum-viable calibration move count (default: 3 moves), deactivate with a brief no-op note and route the user to invoke `/steer` against a richer session.

### Phase 1: Prejudgment — Load Existing Profile

Read the existing project-profile rule file at the chosen layer:

- For `user_global`: `~/.claude/rules/project-profile.md`
- For `project_local`: `.claude/rules/project-profile.md`

Parse the existing six profile variables (revision_cost, deploy_fan_out, dependency_lock_in, runtime_persistence, hermeneutic_circle_availability, notation_maturity) and the calibration result (Extension-default vs Constitution-default vs mixed). When the file does not exist, treat the existing profile as the empty profile P_∅ — the audit then operates as a first-time profile induction rather than a recalibration.

Phase 1 emits no surfacing. The loaded profile becomes the prejudgment baseline against which Phase 2 trial inscription operates.

### Phase 2: Trial Inscription — Scan and Classify

Scan the target session for calibration moves and classify each into a drift cluster.

Scan procedure:
1. Read the target session transcript (`~/.claude/projects/{slug}/{session-id}.jsonl`)
2. Extract calibration move candidates — gate interactions (Constitution / Extension presentations per TOOL GROUNDING), auto-resolutions where AI proceeded without user gate, agent boundary actions (Skill / Agent / SendMessage invocations), Standing-authority delegations
3. For each candidate, identify the move kind (Constitution / Extension / BoundaryAction) and the axis it implicates (which of the six profile variables it bears on, when applicable)

Classification — assign each move to one cluster of the partition:

- **ConstitutionOverapplied** — moves where AI presented a Constitution gate that the loaded profile would have routed to Extension; evidence: existing profile classification → Extension, observed move → Constitution gate. Implication: the existing profile's Extension scope may be too narrow; observed practice prefers user gating.
- **ExtensionMisapplied** — moves where AI auto-resolved (Extension) what the loaded profile would have routed to Constitution; evidence: existing profile classification → Constitution, observed move → auto-resolution. Implication: the existing profile's Constitution-required category may be too broad; observed practice prefers auto-resolution.
- **ProfileDriftConflict** — moves whose evidence supports a profile variable value different from the inscribed value. Implication: the variable assignment itself needs revision toward the value the observed evidence supports.
- **Emergent** — moves whose evidence signals a calibration concern that does not fit the named clusters. The Emergent cluster admits axes outside the six named variables and surfaces them as candidates for taxonomy revision per `project-profile-calibration.md` Stage 2 evidence accumulation.

Phase 2 produces no cumulative score or rate. No "calibration accuracy index", no "drift percentage", no "profile fitness metric". Per-move classification is the entire structured output.

### Phase 3: Validation — Per-Cluster Recognition (Constitution Loop)

For each non-empty cluster, present the cluster's evidence for user-constituted verdict.

Present cluster context as text output before the Constitution interaction. Format per cluster:

```
Cluster [Type] — N moves
  For each move (up to 5 representative moves; remaining counted):
    Move K — turn <turn_index>
      Move kind: <Constitution / Extension / BoundaryAction>
      Axis: <profile variable bearing on the move, if applicable>
      Evidence: <quoted excerpt or paraphrase showing the move and its calibration shape>
      Existing-profile expectation: <what the loaded profile would have classified this move as>
      Observed move: <what AI actually did>
  Cluster implication: <what profile change this cluster collectively suggests>
```

Then present the recognition Constitution interaction:

```
Did this cluster surface a real calibration drift?

Options:
1. Confirm — the cluster represents real drift; carry into the assembled diff
2. Dismiss — the cluster is noise (the moves were appropriate as-is); exclude from diff
3. Reorient — the cluster is real but the implication should be different from presented; specify the alternative implication
4. Stop — exit /steer without further cluster review (assembled-so-far diff goes to Phase 4)
```

Each cluster verdict belongs to the user — confirmation is constituted by the user's selection at this Constitution interaction. After response:

- **Confirm** — record the cluster as confirmed drift; carry implication into Phase 4 tier resolution
- **Dismiss** — record the cluster as user-dismissed noise; exclude from diff
- **Reorient** — accept the user's alternative implication; record cluster as confirmed-with-modified-implication; carry into Phase 4
- **Stop** — break loop; proceed to Phase 4 with whatever has been confirmed so far

Loop Phase 3 over clusters in evidential-strength order (highest-evidence first). Phase 3 honors the cluster set as enumerated in Phase 2 — no dynamic cluster injection during the loop.

### Phase 4: Tier Resolution — Assemble Diff and Fit-Shape Check

Assemble a profile diff from confirmed cluster implications:

1. For each confirmed cluster, translate the cluster implication into a concrete profile variable change (or calibration result change, when the cluster's implication is structural rather than per-variable)
2. Resolve cross-cluster conflicts where two or more clusters propose incompatible values for the same variable; when the conflict requires user judgment, surface it in Phase 5 alongside the candidate values
3. Construct the diff representation: `before` (existing profile) → `after` (proposed profile), variable-by-variable, with provenance citing the confirming cluster(s)
4. Fit-shape check — evaluate whether the assembled diff fits the project-profile.md structure (six variables + Floor / Bounded zone + calibration result). Mismatch signals:
   - **Programmatic-trigger material**: the diff's enforcement requires deterministic detection of a specific tool / command / event (e.g., a particular Bash invocation, a specific slash command, a tool result shape) — prose interpretation cannot reliably substitute
   - **Layer mixing**: the diff compresses universal principle, specific instance, recognition mechanism, and falsification metrics into a single rule-file bullet — the resulting contract is ambiguous between universal rule and concrete operational guidance
   - **Behavioral enforcement focus**: the diff's load-bearing requirement is *what AI does at runtime*, not *what is visible to user judgment* — per `architectural-principles.md §Epistemic Completeness Boundary`, behavioral enforcement is operational-substrate territory (system prompts, hooks, CI/CD, settings.json), not epistemic substrate

When one or more signals fire, accumulate them into `mismatch_signals` (Set(MismatchSignal)) and carry it into Phase 5; the diff itself is still assembled (the user retains override authority — picking Approve forces prose inscription regardless of the recommendation).

Phase 4 emits no surfacing. The assembled diff (with `mismatch_signals` set, possibly empty) becomes the input to Phase 5.

### Phase 5: Circular Return — Final Approve and Write

Present the assembled diff for final user approval. Format:

```
Project Profile Diff — [layer: user_global | project_local]

Before (existing profile):
  <variable>: <value>  — <existing rationale>
  ...

After (proposed profile):
  <variable>: <value>  — <new rationale citing cluster provenance>
  ...

Calibration result delta:
  Before: <Extension-default | Constitution-default | mixed>
  After:  <new classification>

Conflicting clusters (if any):
  <variable>: <candidate_a> vs <candidate_b> — needs user choice

Backup target: <existing_profile_path>.bak.YYYYMMDD-HHMMSS
Write target:  <existing_profile_path>
```

When `mismatch_signals` is non-empty (Phase 4 fit-shape check fired one or more signals), surface them as text output between the diff presentation and the approval interaction:

```
Fit-shape mismatches detected: <signal_a, signal_b, ...> — <one-sentence explanation per signal>
Recommended operational layer: <hook event | system prompt | CI/CD | settings.json | other>
Realization template (if RouteToOperationalLayer is selected): <concrete trigger + behavior outline>
```

Then present the final approval Constitution interaction:

```
How would you like to proceed with this diff?

Options:
1. Approve — write the proposed profile to <write_target>; create backup at <backup_path> first
2. Modify — adjust specific variables before write (specify which and how)
3. Reject — discard the diff; the existing profile remains unchanged; emit NoUpdateNote
4. Defer — emit the diff as a session-text artifact without writing; the user can apply manually later
5. RouteToOperationalLayer — emit OperationalLayerRecommendation artifact (mismatch signal + recommended layer + realization template); rule file unchanged. Surface this option only when Phase 4 fit-shape check fired.
```

After response:

- **Approve** — execute write sequence: (i) create timestamped backup of existing file (or skip backup when existing file is absent), (ii) write the new profile to the target path, (iii) append a structured entry to the trial index (`steer-trials.md` at the same layer scope), (iv) emit UpdatedProjectProfile session-text artifact with the diff trace, the backup path for rollback, and the index entry path
- **Modify** — accept the user's variable-level adjustments, regenerate the diff, re-present Phase 5 Constitution interaction
- **Reject** — emit NoUpdateNote session-text artifact recording the reviewed clusters and dismissed diff; existing file unchanged; trial index untouched (no inscription to track)
- **Defer** — emit the diff as a paste-ready markdown block AND keep the existing profile file unchanged for now; the user retains the audit work for manual application later (distinct from Reject, which discards the diff entirely); trial index untouched until the user manually applies the diff
- **RouteToOperationalLayer** — emit OperationalLayerRecommendation session-text artifact recording: (i) the fit-shape mismatch signal that triggered the routing, (ii) the recommended operational layer per finding shape (hooks, system prompt, CI/CD, settings.json), (iii) a realization template (concrete trigger + behavior outline + scope) for downstream implementation. Append a structured entry to the trial index (`steer-trials.md` at the same layer scope) so the proposed routing is inventoried even when implementation is deferred to a downstream task. Existing rule file unchanged. Steer's role is to recognize the routing and emit the realization template; implementation belongs to a downstream task using the appropriate substrate tooling

After integration, log the disposition. The rule file write (Approve) or the index inscription (Approve and RouteToOperationalLayer) is the Circular Return — the inscribed profile becomes the new prejudgment baseline for the next `/steer` invocation, and the trial index becomes the at-a-glance inventory of trials this project's `/steer` has produced.

```
── FLOW ──
Steer(scope) → Phase0(scope, user_confirm) →
  insufficient(scope): deactivate(no-op note)
  scoped(scope): Load(existing_profile, layer) → P_existing →
    Scan(target_session, M[]) →
    |M[]| < min_viable: deactivate(no-op note)
    |M[]| >= min_viable: Classify(M[], Taxonomy) → clusters →
      Loop over clusters:
        present(cluster, evidence) → Qc(cluster) → Stop → V →
          Confirm(cluster): record_confirmed(cluster) → next
          Dismiss(cluster): record_dismissed(cluster) → next
          Reorient(cluster, implication'): record_modified(cluster, implication') → next
          Stop: break loop
      Assemble(confirmed_clusters, P_existing) → diff →
      fit_shape_check(diff) → mismatch_signals →
      present(diff, backup_path, mismatch_signals) → Qc(approve) → Stop → A →
        Approve: backup(P_existing) → write(P_proposed, layer) → append_index(layer) → emit(UpdatedProjectProfile)
        Modify(adjustments): regenerate(diff, adjustments) → re-present Phase5
        Reject: emit(NoUpdateNote) → no write
        Defer: emit(DiffArtifact) → no write
        RouteToOperationalLayer: append_index(layer) → emit(OperationalLayerRecommendation)
      converge

── MORPHISM ──
SessionCalibrationMoves
  → resolve_scope(user_confirm)         -- scope determination (target session, layer, cross_session)
  → load_existing_profile(layer)        -- prejudgment
  → scan(session, calibration_moves)    -- trial inscription start
  → classify(moves, drift_taxonomy)     -- trial inscription complete
  → present_per_cluster(cluster, V)     -- per-cluster validation
  → assemble_diff(confirmed)            -- tier resolution
  → fit_shape_check(diff)                -- operational-layer material detection
  → present_diff(approve, mismatch_signals)  -- final Constitution interaction
  → [Approve: write(profile, layer, backup); RouteToOperationalLayer: (no write)]
                                          -- branch on disposition; write only on Approve
  → append_index(layer)                   -- trial inventory append (both branches)
  → emit(UpdatedProjectProfile | OperationalLayerRecommendation)
                                          -- circular return (inscription) OR routing artifact
  → UpdatedProjectProfile | OperationalLayerRecommendation
requires: calibration_drift_opaque(scope) ∧ scope_resolved(user)  -- activation precondition + Phase 0 confirmation
deficit:  CalibrationDriftOpaque             -- activation precondition (user-invoked Layer 1)
preserves: SessionHistory                    -- read-only audit; SessionCalibrationMoves are derived
invariant: Recognition over Profile-Mutation, Backup over Risk
                                              -- ProjectProfileFile is mutated at Phase 5 Approve;
                                              -- mutation is gated by Phase 5 Constitution final approve and
                                              -- protected by mandatory pre-write timestamped backup

── TYPES ──
Scope             = { target_session: SessionId, layer: Layer, cross_session: Bool }
SessionId         = String          -- identifier of target session JSONL
Layer             ∈ {user_global, project_local}
CalibrationMove   = { turn_index: Int, kind: MoveKind, axis: Optional(ProfileVariable),
                      observed_classification: Classification,
                      profile_expected_classification: Classification,
                      evidence: String }
MoveKind          ∈ {Constitution, Extension, BoundaryAction}
Classification    ∈ {Constitution, Extension, Mixed, NotApplicable}
ProfileVariable   ∈ {revision_cost, deploy_fan_out, dependency_lock_in,
                     runtime_persistence, hermeneutic_circle_availability, notation_maturity}
                    ∪ Emergent
DriftCluster      ∈ {ConstitutionOverapplied, ExtensionMisapplied, ProfileDriftConflict, Emergent}
Cluster           = { type: DriftCluster, moves: List(CalibrationMove), implication: String }
V                 = ClusterVerdict ∈ {Confirm, Dismiss, Reorient(implication'), Stop}
ProjectProfile    = Map(ProfileVariable, ProfileValue)
ProfileValue      = { value: String, rationale: String }
Diff              = { before: ProjectProfile, after: ProjectProfile,
                      provenance: Map(ProfileVariable, List(DriftCluster)),
                      conflicts: List(VariableConflict) }
VariableConflict  = { variable: ProfileVariable, candidates: List(ProfileValue) }
A                 = ApprovalDisposition ∈ {Approve, Modify(adjustments), Reject, Defer, RouteToOperationalLayer}
MismatchSignal    ∈ {ProgrammaticTrigger, LayerMixing, BehavioralEnforcement} — atomic Phase 4 fit-shape signal
MismatchSignals   = Set(MismatchSignal) — Phase 4 fit-shape check output; empty set when diff fits project-profile.md structure; non-empty set lists all detected signals (compound mismatches are common, e.g., ProgrammaticTrigger + BehavioralEnforcement co-occurring)
RecommendedLayer  ∈ {Hook(HookEvent), SystemPrompt, CI_CD, Settings, Other(String)}
HookEvent         ∈ {SessionStart, SessionEnd, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SubagentStop, PreCompact, Notification}
UpdatedProjectProfile = session text { layer, diff, backup_path, write_path, index_entry_path }
NoUpdateNote      = session text { reviewed_clusters, dismissed_diff }
DiffArtifact      = session text { diff_markdown, suggested_apply_path }
OperationalLayerRecommendation = session text { mismatch_signals: MismatchSignals,
                                                recommended_layer: RecommendedLayer,
                                                realization_template: String,
                                                trial_scope: String,
                                                index_entry_path: Path }
TrialIndexEntry   = { date: ISO8601Date, disposition: A,
                      mismatch_signals: MismatchSignals,
                      recommended_layer: Optional(RecommendedLayer),
                      realization_refs: List(Path | String),
                      origin_context: String,
                      falsification: Optional(String),
                      reevaluation: Optional(String),
                      status: TrialStatus }
TrialStatus       ∈ {active, completed, retracted}
Phase             ∈ {0, 1, 2, 3, 4, 5}

── SCOPE-BINDING ──
bind(scope) = explicit_arg ∪ defaults
Priority: explicit_arg > defaults

/steer "session-id"           → Scope.target_session = "session-id"
/steer --layer=user_global    → Scope.layer = user_global
/steer --cross-session        → Scope.cross_session = true
/steer (alone)                → Scope.target_session = current; Scope.layer inferred from CWD; Scope.cross_session = false

When defaults are inferred, Phase 0 surfaces them in the scope-confirmation Constitution interaction so the user can override before scan begins.

── PHASE TRANSITIONS ──
Phase 0: scope_seed → resolve_defaults → Qc(scope_confirm) → Stop → Scope    -- scope determination [Tool]
Phase 1: Scope → Read(existing_profile_path) → P_existing                     -- prejudgment load [Tool]
           file_absent → P_existing = P_∅ (first-time induction)
Phase 2: Scope → Read(session_jsonl) → extract(M[]) → classify(M[]) → clusters  -- trial inscription [Tool]
           |M[]| < min_viable → deactivate(no-op note)
Phase 3: clusters → loop:
           present(cluster, evidence) → Qc(cluster) → Stop → V → integrate    -- per-cluster Constitution interaction [Tool]
           V = Stop → break loop
Phase 4: confirmed_clusters → assemble_diff(P_existing) → diff →
           fit_shape_check(diff) → mismatch_signals                                -- tier resolution + fit-shape detection (sense)
Phase 5: diff, mismatch_signals → present(diff, backup_path, mismatch_signals) → Qc(approve) → Stop → A  -- final Constitution interaction [Tool]
           A = Approve → Write(backup) → Write(P_proposed) → Append(steer_trials_md) → emit(UpdatedProjectProfile)
           A = Modify → regenerate(diff) → Phase 5 re-entry
           A = Reject → emit(NoUpdateNote)
           A = Defer → emit(DiffArtifact)
           A = RouteToOperationalLayer → Append(steer_trials_md) → emit(OperationalLayerRecommendation)

── LOOP ──
Phase 3 → Phase 4 → Phase 5 →
  Approve: write executed; converge
  Modify: regenerate diff; Phase 5 re-entry
  Reject: no write; converge with NoUpdateNote
  Defer: no write; converge with DiffArtifact
  RouteToOperationalLayer: no write; converge with OperationalLayerRecommendation
Phase 5 Modify re-entry max 3 iterations. Exhausted: surface assembled diff as DiffArtifact (defer) → converge.
Convergence evidence: per disposition, emit one of {UpdatedProjectProfile, NoUpdateNote, DiffArtifact, OperationalLayerRecommendation}.

── CONVERGENCE ──
recognized = all clusters processed (each cluster has Confirm/Dismiss/Reorient verdict OR loop reached Stop)
approved   = A ∈ {Approve, Reject, Defer, RouteToOperationalLayer}
written    = A = Approve ∧ backup_created ∧ write_succeeded
session_text(steer) ∋ {UpdatedProjectProfile | NoUpdateNote | DiffArtifact | OperationalLayerRecommendation}

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 resolve_defaults  (sense)        → Internal analysis (CWD inspection, layer inference)
Phase 0 scope_from_arg    (extension)    → TextPresent+Proceed (when explicit_arg fully specifies scope — target_session, layer, cross_session all explicit; proceed with bound scope; Phase 5 Modify re-entry can adjust)
Phase 0 Qc                (constitution) → present (scope confirmation; when scope partially or fully inferred)
Phase 1 Read              (observe)      → Read (existing project-profile.md at chosen layer)
Phase 2 Read              (observe)      → Read (session JSONL transcript at target session path)
Phase 2 extract           (sense)        → Internal analysis (calibration move identification)
Phase 2 classify          (sense)        → Internal analysis (per-move drift cluster assignment)
Phase 3 present           (extension)    → TextPresent+Proceed (cluster evidence pre-gate)
Phase 3 Qc                (constitution) → present (per-cluster verdict; constitutive user verdict per cluster; Active-authority required at every cluster)
Phase 3 integrate         (track)        → Internal Λ update (cluster verdict recording)
Phase 4 assemble_diff     (sense)        → Internal analysis (variable-level diff construction)
Phase 4 fit_shape_check   (sense)        → Internal analysis (operational-layer material detection — programmatic-trigger / layer-mixing / behavioral-enforcement signals)
Phase 5 present           (extension)    → TextPresent+Proceed (diff + backup path + mismatch_signals pre-gate)
Phase 5 Qc                (constitution) → present (final approval; writable side effect with cross-session persistence; user authority required; option set extends to RouteToOperationalLayer when mismatch_signals is non-empty)
Phase 5 backup            (transform)    → Write (timestamped backup file; Approve disposition only)
Phase 5 Write             (transform)    → Write (proposed profile to layer path; Approve disposition only)
Phase 5 append_index      (transform)    → Write (append TrialIndexEntry to steer-trials.md at chosen layer; Approve and RouteToOperationalLayer dispositions only; create file on first entry)
Phase 5 emit              (extension)    → TextPresent+Proceed (UpdatedProjectProfile or NoUpdateNote or DiffArtifact or OperationalLayerRecommendation, per disposition)
converge                  (extension)    → TextPresent+Proceed (convergence evidence trace)

── MODE STATE ──
Λ = { phase: Phase, scope: Scope, P_existing: ProjectProfile,
      moves: List(CalibrationMove), clusters: List(Cluster),
      cluster_verdicts: List<(Cluster, V)>,
      diff: Optional(Diff), mismatch_signals: MismatchSignals,
      recommended_layer: Optional(RecommendedLayer),
      modify_iterations: Nat,
      backup_path: Optional(Path), write_path: Optional(Path),
      index_path: Optional(Path), index_entry: Optional(TrialIndexEntry),
      disposition: Optional(A), active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Steer composes with `/probe` upstream when a probe disposition routes to /steer (e.g., GapUnnoticed in calibration practice → /steer for retrospective inscription). Steer composes with `/induce` laterally when an in-conversation abstraction crystallization references the project profile (the crystallized abstraction may be inscribed to the rule layer via a subsequent /steer invocation). graph.json edges are absent by design — Steer is a utility skill, not a 13th core protocol.
```

## Storage Reference

**Read paths**:
- Existing profile: `~/.claude/rules/project-profile.md` (user_global) or `.claude/rules/project-profile.md` (project_local)
- Target session transcript: `~/.claude/projects/{slug}/{session-id}.jsonl`
- Optional cross-session evidence (opt-in only): hypomnesis sub-indices at `~/.claude/projects/{slug}/hypomnesis/{session-id}/`

**Write paths**:
- Proposed profile: same path as the existing profile at the chosen layer
- Backup: `<existing_profile_path>.bak.YYYYMMDD-HHMMSS` (timestamp ensures backups accumulate without overwrite); backup is created before the proposed profile write so rollback is `mv <backup_path> <existing_profile_path>`
- Trial index: `.claude/steer-trials.md` (project_local) or `~/.claude/steer-trials.md` (user_global). Lazy-loaded inventory file appended to on Approve and RouteToOperationalLayer dispositions; created on first entry. Reject and Defer leave it untouched.

**First-time induction**: when the existing profile file is absent, Phase 1 treats `P_existing = P_∅` (empty profile). Phase 5 Approve writes the proposed profile without backup (nothing to back up). The emitted UpdatedProjectProfile artifact notes the first-time induction status. The trial index append still occurs.

## Rules

1. **User-invoked only** — Steer activates only on explicit `/steer` invocation. Layer 1/Layer 2 separation is enforced: only the user-invocable layer activates this skill.
2. **Opt-in, default off** — No sticky activation, no background scanning, no implicit re-activation across turns. The user explicitly activates each session.
3. **Current-session default scope** — Default target session is the current session. Other sessions require explicit session_id argument or Phase 0 confirmation.
4. **Cross-session evidence requires explicit confirmation** — Reading prior session calibration history beyond the target session requires explicit user confirmation per invocation.
5. **Per-cluster verdict required** — Every non-empty cluster receives a Constitution verdict from the user before Phase 4 diff assembly proceeds.
6. **Final approval required before write** — Write to the rule file executes only when Phase 5 Approve is selected. Reject and Defer dispositions emit session-text artifacts only; the rule file remains at its current contents.
7. **Pre-write backup mandatory** — When the existing profile file is present, a timestamped backup is created before the proposed profile write. The backup path is surfaced in the Phase 5 Constitution interaction so the user knows the rollback target before approving.
8. **Detection with Authority** — AI detects calibration drift candidates with cited move evidence; the user constitutes per-cluster verdicts and the final approval. The verdict and approval acts are the user's exclusive territory.
9. **Recognition over Recall** — Present structured cluster evidence and verdict options via Cognitive Partnership Move (Constitution) and yield turn. Each cluster verdict option carries differential implication so the post-selection state is anticipatable. The Phase 5 final approval options carry differential downstream trajectories (write executed vs no-write artifact only vs deferred manual apply).
10. **Context-Question Separation** — All cluster evidence and diff context is presented as text output before the Constitution interaction. The interaction contains only the verdict or approval options.
11. **Convergence evidence** — Phase 5 emit produces a transformation trace: per cluster, show (cluster_evidence → user_verdict → diff_contribution); final disposition; backup path when written. Per-cluster evidence is required.
12. **Periagoge family lineage** — Steer extends `/induce`'s morphism with a writable rule inscription step. The dialectical triangulation core is preserved (Phase 3 cluster verdicts and Phase 5 final approval realize the same Confirm / Dismiss / Reorient pattern as `/induce`'s widen / narrow / fuse / reorient / dismiss moves, narrowed to the audit-and-inscribe operation), but `/steer` adds a write step that crosses the `preserves`/`mutates` boundary that `/induce` itself respects. The lineage is operational extension on the output axis, not a type-narrowing specialization.
13. **Coexistence with /probe** — Steer does not replace prospective fit recognition (`/probe`). The pair coexists by time axis and persistence layer: prospective fit recognition (session text, no inscription) versus retrospective calibration with writable rule inscription.
14. **Out-of-scope** — Past protocol contract integrity audit lies outside Steer's territory. Prospective deficit fit recognition is `/probe` territory. In-conversation abstraction crystallization without rule inscription is `/induce` territory. Steer's scope is limited to project-profile rule layer recalibration based on observed Cognitive Partnership Move calibration.
15. **Stage 2 evidence-collection modality** — This skill is released as a Stage 2 evidence-collection instrument; architectural inscription (graph.json placement, advisory edges, formal lineage to /induce) is deferred until variation-stable retention evidence accumulates. Every emitted UpdatedProjectProfile, NoUpdateNote, DiffArtifact, and OperationalLayerRecommendation carries an N=1 dogfooding caveat acknowledging the single-user evidence base.
16. **Vocabulary discipline** — Output uses positive framing: "drift", "calibration", "fit", "recalibration", "induce", "steering". Output frames per-cluster verdicts as recognition acts and the final approval as a writable inscription. The skill describes evidence and diffs; verdicts and approvals belong to the user.
17. **Routing to operational layer when finding shape mismatches** — When the Phase 4 fit-shape check detects that the assembled diff requires programmatic-trigger enforcement, mixes universal principle with specific instance and recognition mechanism, or has behavioral enforcement (rather than visibility) as its load-bearing requirement, surface RouteToOperationalLayer as a Phase 5 disposition. The operational layer (hooks, system prompts, CI/CD, settings.json) realizes Standing-authority delegation per `architectural-principles.md §Epistemic Completeness Boundary`. Steer's role is to recognize the routing and emit a realization template (concrete trigger + behavior outline + scope); implementation belongs to a downstream task using the appropriate substrate tooling. The user retains override authority — selecting Approve forces prose inscription despite the routing recommendation.
18. **Trial index inscription** — On Approve and RouteToOperationalLayer dispositions, append a structured TrialIndexEntry to `steer-trials.md` at the chosen layer (`.claude/steer-trials.md` for project_local, `~/.claude/steer-trials.md` for user_global). The entry records date, disposition type, mismatch signals (always present as a Set — empty for Approve, non-empty for RouteToOperationalLayer), realization references (rule file path or operational-layer artifact paths), origin context, falsification conditions (if specified), reevaluation cadence, and current status. The index file is lazy-loaded — its purpose is single-glance trial inventory across sessions, not per-turn enforcement. Reject and Defer dispositions do not append (no inscription to track yet). The index file is created on first entry; existing entries are not retroactively backfilled. Layer scope of the index matches the disposition's layer — index inscription does not cross layer boundaries.

## UX Safeguards

- **Pre-gate evidence visibility** — All cluster evidence and (in Phase 5) the full diff plus backup path are laid out before the Constitution interaction so the user reads context before deciding (Rule 10 reinforcement; context-question separation is structural).
- **Progress opacity for non-binding aspects** — No "calibration accuracy index", no "drift percentage", no "profile fitness metric". Per-cluster move counts and the diff itself are the entire structured surface (Rule 11 reinforcement).
- **Ephemeral verdict** — Each Phase 3 cluster verdict and Phase 5 approval is a present-tense decision tied to the assembled diff at that moment. The user's verdicts do not bind future `/steer` invocations against different sessions or different existing profiles (Rule 8 reinforcement).
- **Backup-first principle** — When the existing profile file is present, the backup write executes before the proposed profile write. Rollback (`mv <backup_path> <existing_profile_path>`) is always a single shell move (Rule 7 reinforcement).
- **Diff visibility before final approve** — The Phase 5 Constitution interaction is preceded by the full before/after diff with provenance citing confirming clusters. The user reads what will be written before approving (Rule 9 + Rule 10 reinforcement).
- **Self-referential N=1 caveat** — Every emitted artifact (UpdatedProjectProfile, NoUpdateNote, DiffArtifact) carries the caveat acknowledging the single-user evidence base. The skill itself is a Stage 2 evidence-collection instrument, and this caveat is part of how that modality is honored (Rule 15 reinforcement).
- **Defer disposition as escape hatch** — When the user is unsure about writing, the Defer option emits the diff as a session-text artifact for manual application. This honors the "writable side effect needs explicit approval" principle while preserving the audit work (Three-Tier Termination — `user_withdraw`-class disposition with partial state preservation).
- **Operational-layer routing visibility** — When Phase 4 fit-shape check fires, Phase 5 surfaces the mismatch signal and recommended layer alongside the standard approval options. The user retains override authority: Approve forces prose inscription despite the routing recommendation, RouteToOperationalLayer accepts the recommendation and emits a realization template. The diff itself is unchanged across the two paths — routing is about *where* the inscription lives, not *what* it says (Rule 17 reinforcement).
- **Trial index as single-glance inventory** — `steer-trials.md` at the chosen layer accumulates one TrialIndexEntry per Approve and per RouteToOperationalLayer disposition. The file is lazy-loaded so its growth does not inflate per-turn token cost; the user opens it on demand to review what trials are active, completed, or retracted. Each entry is self-contained (date, disposition, realization references, falsification, status) so a single read of the file gives the complete inventory without cross-session JSONL scanning (Rule 18 reinforcement).

## Trigger Signals

Invoke `/steer` when:
- The user senses the project profile is no longer reflecting observed calibration practice
- A recent session contains many gate interactions or auto-resolutions whose pattern has shifted from the inscribed defaults
- The user wants empirical evidence about which Cognitive Partnership Move axes need recalibration before manually editing the rule file
- The user wants to induce a first-time project profile from observed calibration moves (existing file absent)

## Skip Conditions

Skip Steer when:
- The deficit is forward-looking (`/probe`)
- The audit target is past protocol contract integrity rather than Cognitive Partnership Move calibration drift
- The session contains too few calibration moves to support audit (Phase 0 deactivates)
- The user wants in-conversation abstraction crystallization without writable rule inscription (`/induce`)

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key at any Constitution interaction | Deactivate Steer (ungraceful, no disposition record, no write) |
| Phase 0 detects insufficient moves in scope | Deactivate with no-op note |
| Phase 3 user selects Stop | Break loop, proceed to Phase 4 with assembled-so-far |
| Phase 5 user selects Approve | Write executed (profile + trial index append), emit UpdatedProjectProfile, converge |
| Phase 5 user selects Reject | No write, emit NoUpdateNote, converge |
| Phase 5 user selects Defer | No write, emit DiffArtifact, converge |
| Phase 5 user selects RouteToOperationalLayer (only available when fit-shape mismatch detected) | No profile write; trial index append; emit OperationalLayerRecommendation; converge |
| Phase 5 Modify re-entry exhausted (3 max) | Surface assembled diff as DiffArtifact (defer-equivalent) → converge |
