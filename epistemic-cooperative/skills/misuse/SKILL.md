---
name: misuse
description: "Retrospective protocol contract violation detector. Scan past sessions for /ground (Sₐ confabulation) and /induce (stereotype misconflation) contract violations and surface structured violation records for user-constituted review. Use this skill whenever the user asks to 'audit my misuse', 'check protocol misuse', 'scan past invocations', 'misuse history', wants retrospective audit of past /ground or /induce calls, or suspects silent contract violations in prior sessions. Stage 2 evidence-collection instrument."
user_invocable: true
---

# Misuse Skill

Retrospective Contract Violation Detector — when the user wants to audit past `/ground` and `/induce` invocations for silent contract violations, scan session history against contract integrity criteria and surface candidate violations for user-constituted review. Type: `(ContractIntegrityOpaque, AI, AUDIT, SessionHistory) → ViolationReview`.

Invoke directly with `/misuse` when the user wants a retrospective audit of past protocol invocations against their declared Phase 0 contracts.

## Definition

**Misuse** (ἔλεγχος, *élenchos*: examination by drawing out, Socratic refutation): A dialogical act of resolving the opacity of past protocol contract integrity into a recognized violation history, where AI scans session JSONL for `/ground` and `/induce` invocations, classifies each against the contract criteria in `references/violation-taxonomy.md` (LEGITIMATE / VIOLATION / AMBIGUOUS), and the user constitutes the verdict via per-invocation recognition — never AI-resolved verdict assertion.

This skill stands in time-axis dual relationship to `/probe`. Probe is prospective: when a deficit is unrecognized at the present moment, surface candidate hypotheses with reverse-evidence so the user routes forward. Misuse is retrospective: when contract integrity in past invocations is opaque, surface candidate violations with operational evidence so the user audits backward. Both refuse AI-side resolution; both treat user recognition as the constitutive act.

Phase 4 recognition is structurally homologous to Anamnesis Phase 2 — past-identity synthesis (verifying whether a past act conformed to its contract), not future-trajectory selection. The Differential Future Requirement does not apply: a 1-correct option structure (was-violation / was-legitimate) is legitimate by purpose, not a degradation.

## When to Use

Invoke this skill when:
- The user suspects past `/ground` or `/induce` invocations may have violated contract integrity
- The user wants to audit a recent session or set of sessions for silent Sₐ confabulation or stereotype misconflation
- The user wants empirical evidence about misuse patterns to inform calibration of future live nudges or contract refinement

Skip when:
- The deficit is forward-looking (use `/probe` for prospective deficit recognition)
- The user wants accumulated session analytics without contract-violation focus (use `/report` or `/dashboard`)
- The user wants strength-shadow analysis of behavioral patterns (use `/curses`)
- The user is asking about a present-moment invocation, not past invocations

## Distinction from Adjacent Skills

| Skill | Time axis | Subject | Output |
|-------|-----------|---------|--------|
| `/probe` | Prospective (present situation) | Deficit recognition fit review | ProtocolRoute or FitReviewNote |
| `/misuse` | Retrospective (past invocations) | Contract integrity audit | ViolationReview (per-invocation verdict) |
| `/sophia` | Retrospective (behavioral patterns) | Philosophical tradition match | Philosopher profile |
| `/curses` | Retrospective (strengths) | Strength-shadow extraction | Shadow-cost analysis |
| `/report` | Retrospective (usage) | Growth Map | Aggregated insight integration |
| `/dashboard` | Retrospective (coverage) | Protocol coverage analytics | Coverage statistics |

The skill family coexists by phenomenology — none replaces the others. Misuse is for contract integrity; the other retrospective skills serve user-pattern questions.

## Protocol

### Phase 0: Scope Determination

Determine the audit scope before scanning. Decisions:

- **Target protocols** — fixed at `/ground` and `/induce` for v1.0. Other protocols deferred to Stage 2 expansion.
- **Session window** — default is the current session only. Cross-session scanning requires explicit user confirmation per Rule 5.
- **Cross-project scope** — default off. Scanning across `~/.claude/projects/` requires explicit user confirmation.

If the user's `/misuse` invocation does not specify scope, present a Constitution interaction soliciting scope before proceeding to Phase 1. If the user has already specified scope in the invocation, accept it and proceed.

Phase 0 is otherwise silent — no surfacing of detection heuristics. If the user has no past `/ground` or `/induce` invocations in the chosen scope, deactivate with a brief no-op note (Phase 1 will be empty).

### Phase 1: Invocation Extraction

Delegate to the `epistemic-cooperative:session-analyzer` subagent in friction-pointers mode to extract `/ground` and `/induce` slash command invocations from session JSONL files within the chosen scope. For each invocation, retrieve:

- The invocation turn (slash command line)
- 10–20 turns of preceding user messages (pre-invocation context window)
- The assistant turn(s) immediately following the invocation (Phase 0 output of the invoked protocol)

Optional auxiliary read: the `~/.claude/projects/{slug}/hypomnesis/{session-id}/misfit.md` file if present and the user has consented to cross-session scope. This is opt-in evidence enrichment, not a primary data source.

Construct the candidate set `I[]` of `{invocation, pre_context, post_output}` triples.

If `|I[]| = 0`, deactivate with no-op note.

### Phase 2: Per-Invocation Classification

Read `references/violation-taxonomy.md` to load the contract integrity criteria. For each invocation in `I[]`:

1. **Surface shape match** — does the invocation pattern superficially resemble a violation type (e.g., `/ground` with multiple instances and no apparent abstract structure)?
2. **Operation-kind verification** — examine the cognitive operation actually performed against the protocol's declared operation. Surface match alone is insufficient (Rule 1).
3. **Classification** — assign one of:
   - `LEGITIMATE` — contract integrity verified by evidence
   - `VIOLATION` — contract violated; specify violation type (Sₐ confabulation, stereotype misconflation) and cite textual evidence
   - `AMBIGUOUS` — surface match but operation-kind verification produces uncertain result; defaults toward AMBIGUOUS, not VIOLATION (Rule 2)

Each classification must cite specific turn evidence — the user message demonstrating absent framework prior to /ground, or the AI binding of Sₐ without prior user framework, or the named-candidate comparison pattern preceding /induce.

### Phase 3: Pattern Aggregation

Cluster classifications across `I[]`:

- Group by violation type (Sₐ confabulation cluster, stereotype misconflation cluster)
- Identify recurring contexts (project, time period, situation shape)
- Rank candidates by evidential strength (clearest evidence first)
- Suppress AMBIGUOUS classifications from primary presentation; surface them only on user request after VIOLATION review completes

Construct presentation order: highest-evidence VIOLATION candidate first, then descending evidential strength.

Phase 3 produces no cumulative score or rate. No "user reliability index", no "violation percentage", no "trustworthiness metric" (Rule 7).

### Phase 4: Per-Invocation Recognition

Present the highest-priority VIOLATION candidate for user-constituted recognition. Format per candidate:

```
Candidate N — [VIOLATION_TYPE]
  Session: <session_id>, turn <turn_index>
  Invocation: /ground or /induce, with original argument
  Pre-context (10-20 turns): <quoted excerpt or paraphrase showing absence of required framework / presence of named-candidate comparison>
  Phase 0 output: <quoted AI response showing Sₐ binding or stereotype acceptance>
  Violation criterion: <specific clause from violation-taxonomy.md that this invocation contradicts>
```

Then present the recognition Constitution interaction:

```
Did this past invocation violate its contract?

Options:
1. Recognize — violation confirmed (the cited evidence is correctly read)
2. Dismiss — legitimate invocation (the framework was implicit, the context was elsewhere, the cited evidence is misread)
3. Reorient — different violation kind than presented (re-classify against taxonomy)
4. Stop — exit /misuse without further candidates
```

The verdict belongs to the user. AI never asserts violation unilaterally. After response:

- **Recognize** — record the candidate as confirmed violation, proceed to next candidate or converge
- **Dismiss** — record the candidate as user-dismissed legitimate, proceed to next candidate
- **Reorient** — re-classify the candidate; if a different violation type matches, present anew; otherwise dismiss
- **Stop** — deactivate, emit confirmed violations to date

Loop Phase 4 over `I[]` until exhausted, user Stops, or 10 candidates reviewed (whichever first; see Rule 8).

### Phase 5: Emit

After Phase 4 loop completes, emit a `ViolationReview` artifact to session text. Format:

```
## Misuse Audit — [scope description]

Confirmed violations: <count>
Dismissed candidates: <count>
Stopped at: <user disposition or exhaustion>

### Confirmed violations

For each: session_id + turn_index + violation_type + brief evidence summary.

### Calibration metadata (for future Output Style nudge layer)

For each violation type: pre-invocation linguistic patterns observed,
operation-kind verification trace.

### N=1 dogfooding caveat

This audit reflects a single user's session corpus. Patterns are working
hypotheses with N=1 corroboration, not population evidence.
```

The artifact is observation-only. No automated rewrite, no automated reroute (Rule 7). Calibration metadata is the sole structured output beyond the verdicts themselves; downstream live-nudge design is a separate task with its own evidence threshold.

```
── FLOW ──
Misuse(scope) → Phase0(scope, user_confirm) →
  empty(scope): deactivate(no-op note)
  scoped(scope): Extract(scope) → I[] →
    |I[]| = 0: deactivate(no-op note)
    |I[]| > 0: Classify(I[], Taxonomy) → C[] →
      Aggregate(C[]) → ranked(V[]) →
      Loop over V[]:
        present(v, evidence) → Qc(v) → Stop → R →
          Recognize(v): record_confirmed(v) → next
          Dismiss(v): record_dismissed(v) → next
          Reorient(v): reclassify(v) → present anew | dismiss
          Stop: break loop
        |reviewed| ≥ 10: break loop (max review threshold)
      reviewed > 0: emit(ViolationReview) → converge
      reviewed = 0: deactivate(no-op note)

── MORPHISM ──
SessionHistory
  → scope(audit_window)                  -- user-confirmed scope
  → extract(invocations)                 -- /ground and /induce slash command extraction
  → classify(invocation, taxonomy)       -- per-invocation contract integrity check
  → aggregate(classifications)           -- cluster + rank
  → present(candidate, Constitution)     -- per-invocation recognition Constitution interaction
  → recognize(verdict, user)             -- user-constituted verdict (synthesis of identification)
  → emit(ViolationReview)                -- session-text artifact
  → ViolationReview
requires: contract_integrity_opaque(scope)  -- activation precondition (user-invoked)
deficit:  ContractIntegrityOpaque             -- activation precondition
preserves: SessionHistory                     -- read-only audit; no mutation
invariant: Recognition over Verdict-Assertion

── TYPES ──
Scope            = { protocols: Set(ProtocolId), session_window: SessionWindow,
                     cross_project: Bool }
SessionWindow    ∈ {current_session, named_session, time_range, all_sessions}
Invocation       = { protocol: ProtocolId, session_id: SessionId,
                     turn_index: Int, argument: String }
Triple           = { invocation: Invocation, pre_context: List(Turn),
                     post_output: List(Turn) }
I[]              = List(Triple)                  -- candidate set
Taxonomy         = ViolationTaxonomy             -- loaded from references/violation-taxonomy.md
ViolationType    ∈ {SaConfabulation, StereotypeMisconflation, FrameOverextension, Emergent}
Classification   = LEGITIMATE | VIOLATION(ViolationType, Evidence) | AMBIGUOUS(Reason)
Evidence         = { pre_context_quote: String, post_output_quote: String,
                     criterion_cited: String }
C[]              = List({Triple, Classification})
V[]              = List({Triple, ViolationType, Evidence})  -- ranked VIOLATION subset
R                = Verdict ∈ {Recognize, Dismiss, Reorient, Stop}
ViolationReview  = session text { confirmed: List(Triple+Type+Evidence),
                                  dismissed: List(Triple),
                                  calibration_metadata: Prose,
                                  caveat: "N=1 dogfooding" }
ProtocolId       ∈ {ground, induce}              -- v1.0 scope
SessionId        = String (UUID)
Turn             = { role, content, timestamp }
Phase            ∈ {0, 1, 2, 3, 4, 5}

── PHASE TRANSITIONS ──
Phase 0: Scope → Confirm(user) → Phase 1                          -- silent unless scope unspecified
Phase 1: scope → session-analyzer(friction_pointers) → I[]        -- subagent extraction [Tool]
           |I[]| = 0 → emit(no-op note) → deactivate
           |I[]| > 0 → Phase 2
Phase 2: I[] → Read(references/violation-taxonomy.md) → Classify(I[], Taxonomy) → C[]   -- per-invocation classification
Phase 3: C[] → Aggregate(C[]) → V[] (ranked VIOLATION subset)     -- pattern clustering
Phase 4: V[] → for each v: present(v, evidence) → Qc(v) → Stop → R   -- per-invocation Constitution interaction [Tool]
           Recognize(v) → record_confirmed(v) → next | exhaust
           Dismiss(v) → record_dismissed(v) → next | exhaust
           Reorient(v) → reclassify(v) → present anew | dismiss
           Stop → break loop
           |reviewed| ≥ 10 → break loop
Phase 5: emit(ViolationReview) → converge                         -- artifact emission [Tool]

── LOOP ──
Phase 4 internal loop: present → Qc → record → next, bounded by min(|V[]|, 10).
Reorient sub-loop: re-classify → present anew → Qc; bounded by 1 reclassification per candidate (no cycles).

Convergence evidence: ViolationReview emitted with confirmed/dismissed counts and calibration metadata; Stop deactivates without partial artifact when no candidate was reviewed.

── CONVERGENCE ──
reviewed = |confirmed| + |dismissed|
converged = (reviewed > 0 ∧ user_stop_or_exhaust) ∨ |I[]| = 0
session_text(misuse) ∋ ViolationReview when reviewed > 0; empty no-op note when |I[]| = 0

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 scope_confirm  (constitution)  → present (scope Constitution interaction; only if scope unspecified)
Phase 1 extract        (extension)     → Agent(epistemic-cooperative:session-analyzer, mode=friction_pointers)
Phase 1 read_misfit    (extension)     → Read (~/.claude/projects/{slug}/hypomnesis/{session-id}/misfit.md, opt-in)
Phase 2 read_taxonomy  (extension)     → Read (references/violation-taxonomy.md)
Phase 2 classify       (sense)         → Internal analysis (per-invocation 2-step check)
Phase 3 aggregate      (sense)         → Internal analysis (clustering + ranking)
Phase 4 Qc             (constitution)  → present (per-invocation recognition Constitution interaction)
Phase 5 emit           (extension)     → TextPresent+Proceed (ViolationReview)
converge               (extension)     → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
-- Axis: Extension/Constitution = interaction kind; always_gated/elidable = regret profile
Phase 0 scope_confirm (scope unspecified) → always_gated (constitutive scope authorization)
Phase 0 scope_confirm (scope specified)   → elided (user already supplied scope)
Phase 4 Qc (per-invocation verdict)       → always_gated (constitutive user verdict; Standing-authority delegation forbidden)

── MODE STATE ──
Λ = { phase: Phase, scope: Scope,
      candidates: List(Triple), classifications: List(Classification),
      ranked_violations: List(V),
      confirmed: List(Triple+Type+Evidence),
      dismissed: List(Triple),
      reviewed_count: Nat,
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Misuse composes downstream when the user wants to act on confirmed violations (e.g., re-invoke /induce on a Sₐ-confabulation case). Composition target is determined at runtime by user disposition outside this skill (Rule 7 forbids automated reroute), not by static graph.json edges.
```

## Storage Reference

The `~/.claude/projects/{slug}/hypomnesis/{session-id}/misfit.md` file (written by `/probe` sessions) is opt-in auxiliary read input for Phase 1 evidence enrichment. Misuse does not write to this location. Default scope reads only the current session; cross-session reads require explicit user confirmation in Phase 0.

## Rules

1. **Operation-grounded classification** — Surface shape (e.g., "N instances + slash command") is necessary but not sufficient for VIOLATION classification. The cognitive operation actually performed must be examined against the protocol's declared operation. Protocols are defined by cognitive operation, not by input shape (instance count is evidence, not gate).
2. **Self-stereotype guard** — The classifier itself must not commit the same stereotype error it detects. Apply 2-step check (surface match → operation verification). On uncertain operation verification, classify as AMBIGUOUS, not VIOLATION. False-positive cost (eroded protocol use) exceeds false-negative cost (missed violation surfaced later).
3. **N=1 dogfooding caveat** — Heuristics in this skill and its taxonomy are derived from a single-user session corpus. Patterns are working hypotheses with N=1 corroboration, not population evidence. The Phase 5 emit must surface this caveat in the artifact.
4. **Recognition is verification, not decision-axis** — Phase 4 Qc is structurally homologous to Anamnesis Phase 2 recognition gates: past-identity synthesis, not future-trajectory selection. The Differential Future Requirement (which mandates differential downstream trajectories among gate options) does not apply to verification gates whose option structure is determined by verification task requirements. A 1-correct option structure (was-violation / was-legitimate) is legitimate by purpose.
5. **Cross-session opt-in, default off** — Default scope is current session. Reading other sessions or other projects requires explicit user confirmation in Phase 0. This matches `/probe` substrate policy and applies to both session JSONL reads and `misfit.md` reads.
6. **Extension / Constitution vocabulary** — Classification descriptions use the Cognitive Partnership Move vocabulary: Extension (relay-mode, citable basis, deterministic) and Constitution (gated-mode, AI-inference basis, multiple valid results). Older relay/gated phrasing is replaced by the current vocabulary throughout output.
7. **Observation-only artifact** — Misuse never auto-rewrites past sessions, never auto-reroutes a past invocation to a different protocol, never produces a corrective action. Calibration metadata in Phase 5 is for future live-nudge design, not for present action.
8. **Bounded review depth** — Phase 4 loop terminates at `min(|V[]|, 10)` candidates per session of `/misuse`. Audit fatigue erodes verdict quality; bounded review preserves recognition fidelity. The user can re-invoke `/misuse` for additional candidates.
9. **No cumulative score / rate / index** — Across uses, no "violation rate", "user reliability index", "protocol fidelity score", or aggregated metric is produced or stored. Each audit is independent. Aggregation at the cumulative-rate level reintroduces the corrective-judge framing that Rule 7 (observation-only artifact) and Rule 11 (audit-vocabulary) jointly reject.
10. **Verdict belongs to the user** — Recognize / Dismiss / Reorient / Stop is a constitutive user act. AI presents evidence and cited criterion; AI never resolves the verdict unilaterally.
11. **Recommended vocabulary** — Use "violation review", "contract integrity audit", "candidate violation", "evidence", "criterion cited". Vocabulary that frames the skill as a corrective judge (e.g., "wrong", "should have used", "user error") is replaced by the audit-and-fit-review vocabulary.
12. **Recognition over Recall** — Each Phase 4 candidate presents structured evidence (pre-context, post-output, cited criterion) so the user recognizes the violation pattern from presented context, not from memory of the past session.
13. **Detection with Authority** — AI detects candidate violations with cited textual evidence; the user constitutes the verdict. AI never asserts violation unilaterally (Rule 10 reinforcement at the architectural level).
14. **Context-Question Separation** — All evidence (pre-context, post-output, cited criterion) is presented as text output before the Phase 4 Constitution interaction. The interaction contains only the verdict options.
15. **Convergence evidence** — Phase 5 emit produces a transformation trace (scope → extracted invocations → classified candidates → user verdicts → confirmed violations) before declaring convergence.

## UX Safeguards

- **Session immunity for dismissed candidates** — A candidate dismissed in the current `/misuse` session is not re-presented in the same session unless the user re-invokes `/misuse` with explicitly different scope. Re-presenting dismissed candidates erodes the user's verdict authority (Rule 10 reinforcement).
- **Progress opacity** — No progress counter framed as "X of Y violations confirmed" or similar. Presence of such a counter reintroduces the verdict-rate framing that Rule 9 forbids. The Phase 4 loop tracks reviewed-count internally for Rule 8 termination, but does not surface it as a quasi-score.
- **Ephemeral verdicts** — Each `/misuse` audit is a present-tense fit review of past invocations. Verdicts produced in one audit do not bind future audits — the user can re-invoke and reach a different verdict on the same candidate if context shifts.
- **Pre-gate evidence visibility** — All evidence is laid out before the verdict Constitution interaction. The user reads context before deciding (Rule 14 reinforcement; structural).
- **AMBIGUOUS as default tie-break** — When operation verification is uncertain, classify AMBIGUOUS, not VIOLATION. Surface AMBIGUOUS candidates only on user request after primary VIOLATION review (Rule 2 reinforcement).
- **Vocabulary discipline** — Output uses "candidate violation", "audit", "fit review", "evidence", "criterion", "verdict". Output never frames past invocations as mistakes, errors, or culpable acts (Rule 11 reinforcement).
- **Caveat surfacing in artifact** — The Phase 5 ViolationReview artifact explicitly includes the N=1 dogfooding caveat (Rule 3) so downstream readers (including future sessions) inherit the epistemic limitation.

## Trigger Signals

Invoke `/misuse` when:
- The user asks to audit past `/ground` or `/induce` invocations for misuse
- The user suspects silent contract violations in past sessions
- The user wants empirical evidence about misuse patterns to inform future calibration
- The user explicitly invokes `/misuse`

## Skip Conditions

Skip Misuse when:
- The user is asking about a forward-looking deficit (use `/probe`)
- The user wants accumulated session analytics without contract focus (use `/report` or `/dashboard`)
- The user wants strength-shadow analysis (use `/curses`)
- The user is asking about a present-moment invocation, not past invocations
- The chosen scope contains no `/ground` or `/induce` invocations (Phase 1 will deactivate gracefully)

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key | Deactivate Misuse (ungraceful, no artifact) |
| User selects Stop in Phase 4 | Graceful exit; emit partial ViolationReview if any verdicts were given |
| Phase 4 loop exhausts (`|reviewed| ≥ 10` or `|V[]| = 0`) | Emit ViolationReview, deactivate |
| Phase 1 returns empty `|I[]| = 0` | Emit no-op note, deactivate |
| Phase 0 user declines scope confirmation | Deactivate without artifact |
