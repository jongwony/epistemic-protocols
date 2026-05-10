---
name: realign
description: "Project northstar realignment via issue-landscape audit. Scan open issues for northstar-extension, narrowing, reorientation, and stale framing signals against the project guide's northstar declaration, present per-cluster evidence for user-constituted verdict, then write an updated project guide northstar line via Circular Return. Use this skill whenever the user wants to 'realign northstar', 'audit project direction drift', 'reframe project guide', 'reorient northstar from issue landscape', or invokes /realign. Periagoge family — extends /induce with a writable rule inscription step for ProjectNorthstar."
user_invocable: true
---

# Realign Skill

Project Northstar Realignment via Issue-Landscape Audit — when the user wants to refresh the project guide's northstar declaration based on the current open issue landscape, scan issues for northstar-extension, narrowing, reorientation, and stale-framing signals, surface per-cluster evidence for user-constituted verdict, assemble a northstar diff, and write an updated project guide line with timestamped backup. Type: `(NorthstarStale, AI, INDUCE-with-inscription, IssueLandscape) → AlignedNorthstar`.

Invoke directly with `/realign` when the user wants the project northstar to track observed direction-pressure from the open issue backlog rather than remain frozen at initialization time.

## Definition

**Realign** (Periagoge specialization, "course correction"): A dialogical act of resolving the opacity of project northstar drift into a recognized northstar update, where AI scans the current open issue landscape against the existing northstar declaration in the project guide, classifies each issue's directional signal into drift clusters, presents per-cluster evidence for user-constituted verdict, assembles a diff over the northstar declaration, and inscribes the approved diff back into the project guide — northstar mutation belongs to the user's per-cluster verdict and final approval acts.

This skill is a Periagoge family extension. Generic Periagoge (`/induce`) crystallizes an unnamed essence from an instance set into a session-text abstraction. Realign narrows the instance axis to *open issues observed in the current backlog* and extends the output axis with a writable rule inscription step — the inscribed northstar line becomes the new prejudgment baseline for the next invocation. This closing of the loop (audit → inscription → next invocation reads the inscribed baseline) is referred to as **Circular Return** in this skill: the inscribed artifact becomes the prejudgment input the next audit reads from, making the operation self-referential across sessions. The dialectical triangulation core is preserved (Phase 3 per-cluster verdicts and Phase 5 final approval realize the Confirm / Dismiss / Reorient pattern), but the write step crosses the `preserves`/`mutates` boundary that `/induce` itself respects.

This skill stands in functional dual relationship to `/steer`. Both are Periagoge family extensions with writable inscription, and both serve the dispatch read territory. The distinction is the territory each writes to: `/steer` writes the project profile rule (calibration drift axis); `/realign` writes the project guide northstar (mission-direction drift axis). The pair coexists by territory — neither replaces the other.

Phase 3 per-cluster recognition is verification-category — the user verifies the AI's classification accuracy of an already-detected drift cluster, not a forward-trajectory selection. The Differential Future Requirement does not apply to the per-cluster verdict gate by the same logic that exempts Anamnesis Phase 2 recognition gates (past-identity synthesis, not future-trajectory commitment): a 1-correct option structure (was-drift / was-aligned) is legitimate by purpose because downstream diff assembly is a deterministic consequence of the verdict, not a user-selected trajectory. Phase 5 final approve gate IS forward-looking (write or not write) and follows the Differential Future Requirement.

## When to Use

Invoke this skill when:
- The project northstar declaration was set at initialization but the user senses the open issue landscape now points in a direction the declaration does not capture
- The user wants to refresh the project guide's northstar line based on current open issue evidence
- The user wants empirical evidence about which directional axis (extension / narrowing / reorientation / stale-framing) needs recalibration before manually editing the guide
- The current open issue backlog contains enough directional signal to support a meaningful audit (default: at least 3 open issues)

Skip when:
- The deficit is project profile calibration (use `/steer`)
- The deficit is forward-looking deficit recognition (use `/probe`)
- The user wants in-conversation abstraction crystallization without rule inscription (use `/induce` directly)
- The open issue backlog contains too few issues to support audit (Phase 0 deactivates with no-op note)
- The user wants to process the open issue backlog itself (use `/dispatch`); Realign reads the backlog as evidence for direction recalibration, not as work targets

## Distinction from Adjacent Skills

| Skill | Time axis | Subject | Operation | Output | Persistence |
|-------|-----------|---------|-----------|--------|-------------|
| `/probe` | Prospective (present situation) | Deficit recognition fit review | RECOGNIZE | ProtocolRoute or FitReviewNote | Session text |
| `/induce` | In-process (instance set) | Abstraction crystallization | INDUCE | CrystallizedAbstraction | Session text |
| `/steer` | Retrospective (target session) | Cognitive Partnership Move calibration drift | INDUCE extended with writable inscription | UpdatedProjectProfile, NoUpdateNote, DiffArtifact | Writable project-profile rule (Approve disposition) |
| `/realign` | Present-state (open issue landscape) | Project northstar direction drift | INDUCE extended with writable inscription | AlignedNorthstar, NoUpdateNote, DiffArtifact | Writable project guide northstar line (Approve disposition) |
| `/dispatch` | Forward (open issue backlog as work) | Multi-issue parallel resolution | EXECUTE | PRBatch + InscriptionTrace + SkippedSet | PR commits + issue inscriptions |

The skill family coexists by operation and persistence. `/steer` and `/realign` form a functional dual pair on the dispatch read territory: `/steer` writes the calibration profile, `/realign` writes the mission-direction northstar; dispatch reads both. `/realign` and `/dispatch` both consume the open issue backlog but for different purposes — `/realign` reads it as direction-drift evidence; `/dispatch` reads it as work targets.

## Protocol

### Phase 0: Scope Determination

Determine the audit scope before scanning. Three decisions:

- **Issue scope** — default is all open issues in the current repository; the user may narrow by labels, milestone, or specific issue numbers
- **Project guide path** — default is `CLAUDE.md` at the project root; the user may override (e.g., `README.md` for projects whose northstar lives elsewhere)
- **Cross-issue evidence** — default off; reading closed issues / merged PRs for trajectory context beyond the open set requires explicit user confirmation

If the user invocation does not specify scope, present a Constitution interaction soliciting the three decisions before proceeding to Phase 1. If scope is fully specified, accept it and proceed.

Phase 0 is otherwise silent. If the open issue scope contains fewer than the minimum-viable issue count (default: 3 open issues), deactivate with a brief no-op note and route the user to invoke `/realign` when the backlog is richer.

### Phase 1: Prejudgment — Load Existing Northstar

Read the existing project guide at the chosen path and parse the northstar declaration line:

- Default path: `CLAUDE.md`
- Northstar declaration is identified as the first sentence under the `## Project Overview` heading (or equivalent), or by an explicit `<!-- northstar -->` marker if present

When the file does not exist or the northstar line cannot be identified, treat the existing northstar as the empty northstar N_∅ — the audit then operates as a first-time northstar induction rather than a recalibration; Phase 0 surfaces this state in the scope-confirmation interaction.

Phase 1 emits no surfacing. The loaded northstar becomes the prejudgment baseline against which Phase 2 trial inscription operates.

### Phase 2: Trial Inscription — Scan and Classify

Scan the issue landscape and classify each issue's directional signal into a drift cluster.

Scan procedure:
1. Enumerate open issues via the available GitHub interface (gh CLI, MCP `list_issues`, or equivalent)
2. For each issue, capture: number, title, body summary, labels, age (days since opened), comment activity, substrate-cited locks (Out-of-scope clauses, "depends on #N" references, evidence-accumulation gates)
3. Identify the directional signal each issue carries with respect to the loaded northstar

Classification — assign each issue to one cluster of the partition:

- **NorthstarAligned** — issue's framing fits within the current northstar declaration; no signal for change
- **NorthstarExtended** — issue's framing extends in a direction the current northstar does not name; evidence: issue body invokes axes, terminology, or domains absent from the northstar line. Implication: the existing northstar's scope may be too narrow; observed pressure prefers a broader formulation
- **NorthstarNarrowed** — issue's framing operates within a narrower scope than the northstar suggests; evidence: issue body assumes a sub-domain that the northstar's broad framing does not exclusively serve. Implication: the existing northstar may overpromise; observed practice prefers a tighter formulation
- **NorthstarReoriented** — issue's framing centers on an axis orthogonal to the current northstar; evidence: issue body's load-bearing concept is not derivable from the northstar's declared mechanism. Implication: the project's center of gravity may have shifted; observed pressure prefers a reoriented formulation
- **NorthstarStale** — issue's framing assumes a northstar formulation that has since moved (e.g., references prior names, deprecated mechanisms, superseded axes); evidence: issue body's terminology no longer matches the current northstar line. Implication: the northstar line itself needs revision toward terminology the live evidence supports
- **Emergent** — issue's directional signal does not fit the named clusters. The Emergent cluster admits axes outside the named clusters and surfaces them as candidates for taxonomy revision pending accumulated use evidence

Phase 2 produces no cumulative score or rate. No "northstar accuracy index", no "drift percentage", no "alignment metric". Per-issue classification is the entire structured output.

### Phase 3: Validation — Per-Cluster Recognition (Constitution Loop)

For each non-empty cluster (excluding NorthstarAligned, which carries no signal), present the cluster's evidence for user-constituted verdict.

Present cluster context as text output before the Constitution interaction. Format per cluster:

```
Cluster [Type] — N issues
  For each issue (up to 5 representative issues; remaining counted):
    Issue #N — <title>
      Labels: <labels>
      Age: <days> days
      Substrate-cited locks: <locks if any>
      Evidence: <quoted excerpt or paraphrase showing the directional signal>
      Existing-northstar expectation: <what the loaded northstar would have framed this issue as>
      Observed framing: <how the issue body actually frames itself>
  Cluster implication: <what northstar change this cluster collectively suggests>
```

Then propose AI verdict before yielding turn for user constitution:

`AI proposed verdict: <Confirm | Dismiss | Reorient(implication') | Stop>` — one-paragraph classification justification: cluster evidence, counter-evidence considered, and why the cluster IS (or IS NOT) drift under the proposed verdict. Phase 3 is verification-category; the rationale supports classification accuracy, not competitive ranking among peer alternatives.

Then present the recognition Constitution interaction:

```
Did this cluster surface a real northstar drift?

Options:
1. Confirm — the cluster represents real drift; carry into the assembled diff
2. Dismiss — the cluster is noise (the issues were appropriately framed under current northstar); exclude from diff
3. Reorient — the cluster is real but the implication should be different from presented; specify the alternative implication
4. Stop — exit /realign without further cluster review (assembled-so-far diff goes to Phase 4)
```

Each cluster verdict belongs to the user — confirmation is constituted by the user's selection at this Constitution interaction. After response:

- **Confirm** — record the cluster as confirmed drift; carry implication into Phase 4 diff assembly
- **Dismiss** — record the cluster as user-dismissed noise; exclude from diff
- **Reorient** — accept the user's alternative implication; record cluster as confirmed-with-modified-implication; carry into Phase 4
- **Stop** — break loop; proceed to Phase 4 with whatever has been confirmed so far

Loop Phase 3 over clusters in evidential-strength order (highest-evidence first). Phase 3 honors the cluster set as enumerated in Phase 2 — no dynamic cluster injection during the loop.

### Phase 4: Tier Resolution — Assemble Diff and Fit-Shape Check

Assemble a northstar diff from confirmed cluster implications:

1. For each confirmed cluster, translate the cluster implication into a concrete change to the northstar declaration (broaden scope / narrow scope / reorient axis / refresh terminology)
2. Resolve cross-cluster conflicts where two or more clusters propose incompatible changes; when the conflict requires user judgment, surface it in Phase 5 alongside the candidate formulations
3. Construct the diff representation: `before` (existing northstar line) → `after` (proposed northstar line), with provenance citing the confirming cluster(s)
4. Fit-shape check — evaluate whether the assembled diff fits a single-line northstar declaration. Mismatch signals:
   - **MultiLineOverflow**: the proposed northstar requires multiple sentences to express the realigned direction — suggests structural change beyond the single declaration line (may require reorganizing the protocol description block)
   - **GraphImpact**: the proposed reorientation implies changes to `graph.json` edges or protocol precedence — beyond the project guide's scope alone
   - **TerminologyCascade**: the proposed terminology change cascades into multiple downstream documents (rule files, plugin descriptions, protocol prose) — wider inscription scope than a single line

When one or more signals fire, accumulate them into `mismatch_signals` and carry into Phase 5; the diff itself is still assembled.

Phase 4 emits no surfacing. The assembled diff (with `mismatch_signals` set, possibly empty) becomes the input to Phase 5.

### Phase 5: Circular Return — Final Approve and Write

Present the assembled diff for final user approval. Format:

```
Project Northstar Diff — [project guide: <path>]

Before (existing northstar):
  <line: existing declaration>

After (proposed northstar):
  <line: new declaration with provenance citing cluster(s)>

Conflicting clusters (if any):
  <axis>: <candidate_a> vs <candidate_b> — needs user choice

Backup target: <project_guide_path>.bak.YYYYMMDD-HHMMSS
Write target:  <project_guide_path>
```

When `mismatch_signals` is non-empty, surface them as text output between the diff presentation and the approval interaction:

```
Fit-shape mismatches detected: <signal_a, signal_b, ...> — <one-sentence explanation per signal>
Recommended downstream scope: <multi-line restructure | graph.json edit | terminology cascade tracking | other>
```

Then propose AI disposition before yielding turn for user constitution:

`AI proposed disposition: <Approve | Modify | Reject | Defer | RouteToOperationalLayer>` — one-paragraph rationale referencing diff scope, fit-shape signals, backup/rollback availability, and why the proposed disposition dominates alternatives.

Then present the final approval Constitution interaction:

```
How would you like to proceed with this diff?

Options:
1. Approve — write the proposed northstar line to <write_target>; create backup at <backup_path> first
2. Modify — adjust the proposed line before write (specify the change)
3. Reject — discard the diff; the existing northstar remains unchanged; emit NoUpdateNote
4. Defer — emit the diff as a session-text artifact without writing; the user can apply manually later
5. RouteToOperationalLayer — emit OperationalLayerRecommendation artifact (mismatch signal + recommended downstream scope + implementation outline); project guide unchanged. Surface this option only when Phase 4 fit-shape check fired.
```

After response:

- **Approve** — execute write sequence: (i) create timestamped backup of existing project guide, (ii) write the new northstar line at the same position, (iii) append a structured entry to the trial index (`realign-trials.md` at project root or a configured location), (iv) emit AlignedNorthstar session-text artifact with the diff trace, the backup path for rollback, and the index entry path
- **Modify** — accept the user's adjustments, regenerate the diff, re-present Phase 5 Constitution interaction (max 3 iterations; exhausted → emit DiffArtifact)
- **Reject** — emit NoUpdateNote session-text artifact; project guide unchanged
- **Defer** — emit the diff as a paste-ready markdown block; project guide unchanged
- **RouteToOperationalLayer** — emit OperationalLayerRecommendation session-text artifact recording: (i) the fit-shape mismatch signal, (ii) the recommended downstream scope, (iii) an implementation outline. Append to trial index. Project guide unchanged. Realign's role is to recognize the routing and emit the implementation outline; downstream work belongs to a separate task

After integration, log the disposition. The project guide write (Approve) or the index inscription (Approve and RouteToOperationalLayer) is the Circular Return — the inscribed northstar becomes the new prejudgment baseline for the next `/realign` invocation, and the trial index becomes the at-a-glance inventory of trials this project's `/realign` has produced.

```
── FLOW ──
Realign(scope) → Phase0(scope, user_confirm) →
  insufficient(scope): deactivate(no-op note)
  scoped(scope): Load(existing_northstar, project_guide_path) → N_existing →
    Scan(open_issues, I[]) →
    |I[]| < min_viable: deactivate(no-op note)
    |I[]| >= min_viable: Classify(I[], Taxonomy) → clusters →
      Loop over non-empty clusters (excluding NorthstarAligned):
        present(cluster, evidence) → Qc(cluster) → Stop → V →
          Confirm(cluster): record_confirmed(cluster) → next
          Dismiss(cluster): record_dismissed(cluster) → next
          Reorient(cluster, implication'): record_modified(cluster, implication') → next
          Stop: break loop
      Assemble(confirmed_clusters, N_existing) → diff →
      fit_shape_check(diff) → mismatch_signals →
      present(diff, backup_path, mismatch_signals) → Qc(approve) → Stop → A →
        Approve: backup(N_existing) → write(N_proposed, project_guide_path) → append_index → emit(AlignedNorthstar)
        Modify(adjustments): regenerate(diff, adjustments) → re-present Phase5
        Reject: emit(NoUpdateNote) → no write
        Defer: emit(DiffArtifact) → no write
        RouteToOperationalLayer: append_index → emit(OperationalLayerRecommendation)
      converge

── MORPHISM ──
IssueLandscape
  → resolve_scope(user_confirm)         -- scope determination (issue scope, guide path, cross-issue)
  → load_existing_northstar(path)       -- prejudgment
  → scan(open_issues, I[])              -- trial inscription start
  → classify(I[], drift_taxonomy)        -- trial inscription complete
  → present_per_cluster(cluster, V)     -- per-cluster validation
  → assemble_diff(confirmed)            -- diff construction
  → fit_shape_check(diff)               -- downstream-scope material detection
  → present_diff(approve, mismatch_signals)  -- final Constitution interaction
  → [Approve: write(northstar, guide_path, backup); RouteToOperationalLayer: (no write)]
  → append_index                         -- trial inventory append (both branches)
  → emit(AlignedNorthstar | OperationalLayerRecommendation)
  → AlignedNorthstar | OperationalLayerRecommendation
requires: northstar_drift_opaque(scope) ∧ scope_resolved(user)
deficit:  NorthstarStale
preserves: IssueLandscape (read-only audit; classifications are derived)
invariant: Recognition over Northstar-Mutation, Backup over Risk

── TYPES ──
Scope             = { issue_scope: IssueScope, guide_path: Path, cross_issue: Bool }
IssueScope        = { state: 'open' | 'closed' | 'all', labels: Set(String),
                      milestone: Optional(String), numbers: Optional(Set(Int)) }
Issue             = { number: Int, title: String, body: String, labels: Set(String),
                      age_days: Int, comment_count: Int,
                      substrate_locks: Set(SubstrateLock) }
SubstrateLock     ∈ {OutOfScope, DependsOn(Int), EvidenceGate, ConditionFired}
DriftCluster      ∈ {NorthstarAligned, NorthstarExtended, NorthstarNarrowed,
                     NorthstarReoriented, NorthstarStale, Emergent}
Cluster           = { type: DriftCluster, issues: List(Issue), implication: String }
V                 = ClusterVerdict ∈ {Confirm, Dismiss, Reorient(implication'), Stop}
Northstar         = String  -- single-line declaration
Diff              = { before: Northstar, after: Northstar,
                      provenance: Map(Change, List(DriftCluster)),
                      conflicts: List(NorthstarConflict) }
NorthstarConflict = { axis: String, candidates: List(Northstar) }
A                 = ApprovalDisposition ∈ {Approve, Modify(adjustments), Reject, Defer, RouteToOperationalLayer}
MismatchSignal    ∈ {MultiLineOverflow, GraphImpact, TerminologyCascade}
MismatchSignals   = Set(MismatchSignal)
RecommendedScope  ∈ {MultiLineRestructure, GraphEdit, TerminologyCascadeTracking, Other(String)}
AlignedNorthstar  = session text { guide_path, diff, backup_path, write_path, index_entry_path }
NoUpdateNote      = session text { reviewed_clusters, dismissed_diff }
DiffArtifact      = session text { diff_markdown, suggested_apply_path }
OperationalLayerRecommendation = session text { mismatch_signals: MismatchSignals,
                                                recommended_scope: RecommendedScope,
                                                implementation_outline: String,
                                                trial_scope: String,
                                                index_entry_path: Path }
TrialIndexEntry   = { date: ISO8601Date, disposition: A,
                      mismatch_signals: MismatchSignals,
                      recommended_scope: Optional(RecommendedScope),
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

/realign "labels=axiom,architecture"  → Scope.issue_scope.labels = {axiom, architecture}
/realign --milestone="v2026.06"       → Scope.issue_scope.milestone = "v2026.06"
/realign --guide=README.md            → Scope.guide_path = README.md
/realign --cross-issue                → Scope.cross_issue = true
/realign (alone)                      → Scope.issue_scope = all open; Scope.guide_path = CLAUDE.md;
                                         Scope.cross_issue = false

When defaults are inferred, Phase 0 surfaces them in the scope-confirmation Constitution interaction so the user can override before scan begins.

── PHASE TRANSITIONS ──
Phase 0: scope_seed → resolve_defaults → Qc(scope_confirm) → Stop → Scope        -- scope determination [Tool]
Phase 1: Scope → Read(guide_path) → parse_northstar_line → N_existing             -- prejudgment load [Tool]
           file_absent ∨ line_unidentifiable → N_existing = N_∅ (first-time induction)
Phase 2: Scope → Fetch(open_issues) → extract(I[]) → classify(I[]) → clusters    -- trial inscription [Tool]
           |I[]| < min_viable → deactivate(no-op note)
Phase 3: clusters → loop:
           present(cluster, evidence) → Qc(cluster) → Stop → V → integrate        -- per-cluster Constitution interaction [Tool]
           V = Stop → break loop
Phase 4: confirmed_clusters → assemble_diff(N_existing) → diff →
           fit_shape_check(diff) → mismatch_signals                                 -- diff assembly + fit-shape detection (sense)
Phase 5: diff, mismatch_signals → present(diff, backup_path, mismatch_signals) → Qc(approve) → Stop → A  -- final Constitution interaction [Tool]
           A = Approve → Write(backup) → Write(N_proposed) → Append(realign_trials_md) → emit(AlignedNorthstar)
           A = Modify → regenerate(diff) → Phase 5 re-entry
           A = Reject → emit(NoUpdateNote)
           A = Defer → emit(DiffArtifact)
           A = RouteToOperationalLayer → Append(realign_trials_md) → emit(OperationalLayerRecommendation)

── LOOP ──
Phase 3 → Phase 4 → Phase 5 →
  Approve: write executed; converge
  Modify: regenerate diff; Phase 5 re-entry
  Reject: no write; converge with NoUpdateNote
  Defer: no write; converge with DiffArtifact
  RouteToOperationalLayer: no write; converge with OperationalLayerRecommendation
Phase 5 Modify re-entry max 3 iterations. Exhausted: surface assembled diff as DiffArtifact (defer) → converge.
Convergence evidence: per disposition, emit one of {AlignedNorthstar, NoUpdateNote, DiffArtifact, OperationalLayerRecommendation}.

── CONVERGENCE ──
recognized = all non-empty clusters processed (each cluster has Confirm/Dismiss/Reorient verdict OR loop reached Stop)
approved   = A ∈ {Approve, Reject, Defer, RouteToOperationalLayer}
written    = A = Approve ∧ backup_created ∧ write_succeeded
session_text(realign) ∋ {AlignedNorthstar | NoUpdateNote | DiffArtifact | OperationalLayerRecommendation}

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 resolve_defaults  (sense)        → Internal analysis (CWD inspection, guide path inference)
Phase 0 scope_from_arg    (extension)    → TextPresent+Proceed (when explicit_arg fully specifies scope; proceed with bound scope; Phase 5 Modify re-entry can adjust)
Phase 0 Qc                (constitution) → present (scope confirmation; when scope partially or fully inferred)
Phase 1 Read              (observe)      → Read (project guide at chosen path)
Phase 1 parse_northstar   (sense)        → Internal analysis (line identification under Project Overview heading or marker)
Phase 2 Fetch             (observe)      → Bash (gh issue list / gh issue view) or MCP list_issues equivalent
Phase 2 extract           (sense)        → Internal analysis (issue field extraction)
Phase 2 classify          (sense)        → Internal analysis (per-issue drift cluster assignment)
Phase 3 present           (extension)    → TextPresent+Proceed (cluster evidence pre-gate)
Phase 3 Qc                (constitution) → present (per-cluster verdict; constitutive user verdict per cluster; Active-authority required at every cluster)
Phase 3 integrate         (track)        → Internal Λ update (cluster verdict recording)
Phase 4 assemble_diff     (sense)        → Internal analysis (northstar-line diff construction)
Phase 4 fit_shape_check   (sense)        → Internal analysis (downstream-scope material detection)
Phase 5 present           (extension)    → TextPresent+Proceed (diff + backup path + mismatch_signals pre-gate)
Phase 5 Qc                (constitution) → present (final approval; writable side effect with cross-session persistence; user authority required; option set extends to RouteToOperationalLayer when mismatch_signals is non-empty)
Phase 5 backup            (transform)    → Write (timestamped backup file; Approve disposition only)
Phase 5 Write             (transform)    → Write (proposed northstar line to guide_path; Approve disposition only)
Phase 5 append_index      (transform)    → Write (append TrialIndexEntry to realign-trials.md at project root; Approve and RouteToOperationalLayer dispositions only; create file on first entry)
Phase 5 emit              (extension)    → TextPresent+Proceed (AlignedNorthstar or NoUpdateNote or DiffArtifact or OperationalLayerRecommendation, per disposition)
converge                  (extension)    → TextPresent+Proceed (convergence evidence trace)

── MODE STATE ──
Λ = { phase: Phase, scope: Scope, N_existing: Northstar,
      issues: List(Issue), clusters: List(Cluster),
      cluster_verdicts: List<(Cluster, V)>,
      diff: Optional(Diff), mismatch_signals: MismatchSignals,
      recommended_scope: Optional(RecommendedScope),
      modify_iterations: Nat,
      backup_path: Optional(Path), write_path: Optional(Path),
      index_path: Optional(Path), index_entry: Optional(TrialIndexEntry),
      disposition: Optional(A), active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Realign composes with `/probe` upstream when a probe disposition routes to /realign (e.g., directional opacity in current backlog → /realign for present-state inscription). Realign and `/steer` form a functional dual pair on the dispatch read territory; both compose laterally (an inscribed northstar may be referenced in a subsequent /steer audit; an inscribed profile may inform a subsequent /realign cluster classification). graph.json edges are absent by design — Realign is a utility skill, not a 13th core protocol.
```

## Storage Reference

**Read paths**:
- Existing project guide: `CLAUDE.md` at project root (default) or user-specified path
- Open issue source: GitHub repository via `gh` CLI or MCP `list_issues`
- Optional cross-issue evidence (opt-in only): closed issues / merged PRs via the same interfaces

**Write paths**:
- Proposed northstar line: same path as the existing project guide, at the position identified in Phase 1
- Backup: `<project_guide_path>.bak.YYYYMMDD-HHMMSS` (timestamp ensures backups accumulate without overwrite); backup is created before the proposed write so rollback is `mv <backup_path> <project_guide_path>`
- Trial index: `realign-trials.md` at project root (default). Lazy-loaded inventory file appended to on Approve and RouteToOperationalLayer dispositions; created on first entry. Reject and Defer leave it untouched.

**First-time induction**: when the existing project guide does not contain an identifiable northstar line, Phase 1 treats `N_existing = N_∅`. Phase 5 Approve writes the proposed northstar without backup of the line itself (the project guide may still be backed up if it exists). The emitted AlignedNorthstar artifact notes the first-time induction status. The trial index append still occurs.

## Rules

1. **User-invoked only** — Realign activates only on explicit `/realign` invocation. Layer 1/Layer 2 separation is enforced: only the user-invocable layer activates this skill. No auto-trigger from dispatch outcomes (Safeguard tier — revisitable as accumulated evidence justifies optional auto-suggest behavior).
2. **Opt-in, default off** — No sticky activation, no background scanning, no implicit re-activation across turns.
3. **Open-issue default scope** — Default issue scope is all open issues in the current repository. Closed issues, milestones, and label filters require explicit scope arguments or Phase 0 confirmation.
4. **Cross-issue evidence requires explicit confirmation** — Reading closed issues or merged PRs for trajectory context beyond the open set requires explicit user confirmation per invocation.
5. **Per-cluster verdict required** — Every non-empty non-Aligned cluster receives a Constitution verdict from the user before Phase 4 diff assembly proceeds.
6. **Final approval required before write** — Write to the project guide executes only when Phase 5 Approve is selected. Reject and Defer dispositions emit session-text artifacts only; the project guide remains at its current contents.
7. **Pre-write backup mandatory** — When the existing project guide is present, a timestamped backup is created before the proposed northstar write. The backup path is surfaced in the Phase 5 Constitution interaction so the user knows the rollback target before approving.
8. **Detection with Authority** — AI detects directional drift candidates with cited issue evidence and proposes its own verdict (Phase 3) and disposition (Phase 5) with rationale; the user constitutes per-cluster verdicts and the final approval. AI proposal IS what surfaces the AI's evidence-grounded reading before user constitution — the user evaluates a concrete position rather than constituting a verdict against undifferentiated cluster data. The verdict and approval acts remain the user's exclusive territory.
9. **Recognition over Recall** — Present structured cluster evidence and verdict options via Cognitive Partnership Move (Constitution) and yield turn. Each cluster verdict option carries differential implication so the post-selection state is anticipatable.
10. **Context-Question Separation** — All cluster evidence and diff context is presented as text output before the Constitution interaction. The interaction contains only the verdict or approval options.
11. **Convergence evidence** — Phase 5 emit produces a transformation trace: per cluster, show (cluster_evidence → user_verdict → diff_contribution); final disposition; backup path when written. Per-cluster evidence is required.
12. **Periagoge family lineage** — Realign extends `/induce`'s morphism with a writable rule inscription step. The dialectical triangulation core is preserved (Phase 3 cluster verdicts and Phase 5 final approval realize the same Confirm / Dismiss / Reorient pattern as `/induce`'s widen / narrow / fuse / reorient / dismiss moves, narrowed to the audit-and-inscribe operation), but `/realign` adds a write step that crosses the `preserves`/`mutates` boundary that `/induce` itself respects.
13. **Functional dual with /steer** — Realign and Steer form a functional dual pair on the dispatch read territory: Steer writes the project profile (calibration drift axis), Realign writes the project guide northstar (mission-direction drift axis). Neither replaces the other; the pair coexists by territory.
14. **Coexistence with /dispatch** — Realign reads the open issue backlog as direction-drift evidence; Dispatch reads it as work targets. Same substrate, distinct purposes. Dispatch may optionally invoke Realign as Phase 0 enrichment when the user wants northstar recalibration before issue categorization, but invocation remains user-initiated.
15. **Out-of-scope** — Cognitive Partnership Move calibration is outside Realign's territory (use `/steer`). Prospective deficit fit recognition is outside Realign's territory (use `/probe`). Multi-issue parallel resolution is outside Realign's territory (use `/dispatch`).
16. **Provisional release modality** — This skill is released provisionally; architectural inscription (graph.json placement, advisory edges, formal lineage to /induce, optional auto-suggest from dispatch high skip-ratio) is deferred pending accumulated cross-session use evidence.
17. **Vocabulary discipline** — Output uses positive framing: "drift", "alignment", "fit", "realignment", "induce", "reorientation". Output frames per-cluster verdicts as recognition acts and the final approval as a writable inscription. The skill describes evidence and diffs; verdicts and approvals belong to the user.
18. **Routing to operational layer when finding shape mismatches** — When the Phase 4 fit-shape check detects multi-line overflow, graph impact, or terminology cascade, surface RouteToOperationalLayer as a Phase 5 disposition. The downstream scope (multi-line restructure, graph.json edit, terminology cascade tracking) realizes implementation work distinct from northstar prose inscription. Realign's role is to recognize the routing and emit the implementation outline; implementation belongs to a downstream task.
19. **Trial index inscription** — On Approve and RouteToOperationalLayer dispositions, append a structured TrialIndexEntry to `realign-trials.md` at project root. The entry records date, disposition type, mismatch signals (always present as a Set — empty for Approve, non-empty for RouteToOperationalLayer), realization references (project guide path or downstream artifact paths), origin context, falsification conditions (if specified), reevaluation cadence, and current status. The index file is lazy-loaded — its purpose is single-glance trial inventory across sessions, not per-turn enforcement. Reject and Defer dispositions do not append. The index file is created on first entry; existing entries are not retroactively backfilled.

## UX Safeguards

- **Pre-gate evidence visibility** — All cluster evidence and (in Phase 5) the full diff plus backup path are laid out before the Constitution interaction so the user reads context before deciding.
- **Progress opacity for non-binding aspects** — No "northstar accuracy index", no "drift percentage", no "alignment metric". Per-cluster issue counts and the diff itself are the entire structured surface.
- **Ephemeral verdict** — Each Phase 3 cluster verdict and Phase 5 approval is a present-tense decision tied to the assembled diff at that moment. The user's verdicts do not bind future `/realign` invocations against different backlogs or different existing northstars.
- **Backup-first principle** — When the existing project guide is present, the backup write executes before the proposed northstar write. Rollback is always a single shell move.
- **Diff visibility before final approve** — The Phase 5 Constitution interaction is preceded by the full before/after diff with provenance citing confirming clusters.
- **Defer disposition as escape hatch** — When the user is unsure about writing, the Defer option emits the diff as a session-text artifact for manual application.
- **Operational-layer routing visibility** — When Phase 4 fit-shape check fires, Phase 5 surfaces the mismatch signal and recommended downstream scope alongside the standard approval options. The user retains override authority: Approve forces northstar prose inscription despite the routing recommendation; RouteToOperationalLayer accepts the recommendation and emits an implementation outline.
- **Trial index as single-glance inventory** — `realign-trials.md` accumulates one TrialIndexEntry per Approve and per RouteToOperationalLayer disposition. The file is lazy-loaded so its growth does not inflate per-turn token cost.

## Trigger Signals

Invoke `/realign` when:
- The user senses the project northstar declaration no longer captures where the open backlog is pointing
- The current open issue set contains many issues whose framing extends, narrows, reorients, or makes stale the existing northstar
- The user wants empirical evidence about which directional axis needs recalibration before manually editing the project guide
- The user wants to induce a first-time project northstar from the open issue landscape (existing line absent or unidentifiable)

## Skip Conditions

Skip Realign when:
- The deficit is project profile calibration (`/steer`)
- The deficit is forward-looking deficit recognition (`/probe`)
- The user wants in-conversation abstraction crystallization without writable inscription (`/induce`)
- The open issue backlog is too thin to support audit (Phase 0 deactivates)
- The user wants to process the backlog itself (`/dispatch`); Realign reads it as evidence, not as work targets

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key at any Constitution interaction | Deactivate Realign (ungraceful, no disposition record, no write) |
| Phase 0 detects insufficient issues in scope | Deactivate with no-op note |
| Phase 3 user selects Stop | Break loop, proceed to Phase 4 with assembled-so-far |
| Phase 5 user selects Approve | Write executed (northstar + trial index append), emit AlignedNorthstar, converge |
| Phase 5 user selects Reject | No write, emit NoUpdateNote, converge |
| Phase 5 user selects Defer | No write, emit DiffArtifact, converge |
| Phase 5 user selects RouteToOperationalLayer (only available when fit-shape mismatch detected) | No northstar write; trial index append; emit OperationalLayerRecommendation; converge |
| Phase 5 Modify re-entry exhausted (3 max) | Surface assembled diff as DiffArtifact (defer-equivalent) → converge |
