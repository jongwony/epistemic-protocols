---
name: probe
description: "Deficit Recognition Probe — surface multiple deficit hypotheses for the user's current situation and route by user-constituted recognition (fit review, not protocol scoring)."
user_invocable: true
---

# Probe Skill

Deficit Recognition Probe — when the user is uncertain which epistemic deficit (and therefore which protocol) fits the current situation, surface AI-generated multi-hypothesis candidates with reverse-evidence conditions, and route on user-constituted recognition. Type: `(DeficitUnrecognized, AI, RECOGNIZE, UserSituation) → ProtocolRoute`.

Invoke directly with `/probe` when the user wants a fit review across the protocol catalog before committing to a single protocol invocation.

## Definition

**Probe** (ἐπίγνωσις, *epígnōsis*: knowing-upon, recognition of what was already there): A dialogical act of resolving a user's vague sense that "something is off" into a recognized deficit + protocol route, where AI scans the user's recent situation against the catalog of epistemic deficits, presents at minimum two hypotheses with falsification conditions, and the user constitutes the route via recognition — never AI-resolved scoring.

This skill stands in structural homology with Anamnesis (`/recollect`) — both realize the RECOGNIZE operation family. Anamnesis recognizes past context from vague recall; Probe recognizes present-situation deficit from vague unease. Anamnesis output is `RecalledContext`; Probe output is `ProtocolRoute`. Both treat user recognition as the constitutive act and refuse AI-side resolution.

## When to Use

Invoke this skill when:
- The user feels something is off but does not yet name which epistemic deficit fits
- A protocol invocation is being considered, and the user wants a fit review across alternatives before committing
- Multiple plausible routes coexist (e.g., "is this a goal problem or a context problem?") and the user wants the alternatives surfaced explicitly with their reverse-evidence conditions

Skip when:
- The deficit is already named with confidence (invoke the matching protocol directly)
- The user wants a passive reference handbook (use `/catalog`)
- The user wants pattern-based recommendation from session history with optional trial (use `/onboard`)
- The user wants accumulated session analytics (use `/report` or `/dashboard`)

## Distinction from /catalog and /onboard

| Skill | Stance | Input | Output |
|-------|--------|-------|--------|
| `/catalog` | Passive reference | Browse / lookup | Static handbook entries |
| `/onboard` | Pattern-based recommendation + optional trial | Session history patterns | Recommended protocol + scenario + trial |
| `/probe` | Active AI-hypothesized deficit recognition | Current user situation | At minimum two hypothesis candidates + user-constituted route |

The three coexist by design — none replaces the others. Probe is for experienced users with frame-binding uncertainty; `/catalog` is for users who already know the question; `/onboard` is for users who want pattern-based learning.

## Protocol

### Phase 0: Detection

Detect that the user's situation admits ambiguous deficit framing. Heuristics:

- The user's request describes symptoms ("something feels off", "not sure which protocol") rather than naming a deficit
- The session shows a pattern that maps to two or more candidate deficits with comparable plausibility
- The user explicitly invokes `/probe`

Phase 0 is silent — no surfacing. If detection fails (deficit is already clearly named), deactivate.

### Phase 1: Catalog Scan

Scan the user's situation against the full catalog of 12 epistemic deficits. For each candidate hypothesis, build a `Set(CoverageEntry)` where each entry pairs:

- A `deficit: DeficitName` matched against the situation
- The `protocol: ProtocolId` that addresses that deficit
- `evidence: Evidence` — the situation signal supporting the match
- `reverse_evidence: Evidence` — the observation that would shrink the coverage to exclude this entry

A hypothesis with `|coverage| = 1` is a single-protocol projection (preserves prior single-protocol behavior). A hypothesis with `|coverage| ≥ 2` is a set-valued coverage — multi-protocol projection within one hypothesis. This intra-hypothesis multi-protocol projection is structurally distinct from the inter-protocol composition defined in the `── COMPOSITION ──` block; do not conflate the two.

When `Λ.coverage_constraint` is set (from a prior `Narrow(CoverageSubset)`), filter the scan output to hypotheses whose coverage protocol set intersects with the constraint — this preserves user-directed narrowing across re-scan iterations.

Construct the candidate set. Keep at minimum two candidates with non-overlapping reverse-evidence conditions — singleton high-confidence framing is forbidden (see Rules section, Rule 5).

### Phase 2: Hypothesis Presentation

Present the candidate hypotheses as text output before the Constitution interaction. Each rendered line under `Coverage:` corresponds to one `CoverageEntry` (deficit, protocol, evidence, reverse_evidence). Format per hypothesis:

```
Hypothesis N — N interpretations possible / decision point is X
  Coverage:
    /<protocol_a> (<DeficitName>):
      Evidence: <quote or paraphrase>
      Reverse-evidence: <observation that would shrink coverage to exclude this entry>
    /<protocol_b> (<DeficitName>):
      Evidence: <...>
      Reverse-evidence: <...>
  (Singleton |coverage|=1: render the single CoverageEntry as one protocol line, equivalent to prior single-protocol format)
```

**Coverage option-set minimality**: When `|coverage| ≥ 2`, coverage subsets are NOT enumerated as additional options — the per-entry Evidence and Reverse-evidence within the Coverage block serve as the short descriptions that guide singleton selection. The user invokes a singleton through free response or `Narrow(CoverageSubset)`. This preserves option-set minimality and induces the Hermeneutic circle through iterative user-initiated dialogue rather than AI-side menu expansion. (Per Rule 14, this contextual rule informs the gate decision and therefore precedes the gate options.)

Present the recognition Constitution interaction as a free-response prompt:

```
Which hypothesis fits your present situation?

Free response — the disposition is constituted by the user's natural utterance.
Recognition / Redirect / Dismiss / Narrow scope / Stop are all reachable via free response;
Phase 3 parses the utterance into the corresponding R coproduct constructor.
The hypothesis surface above carries the full deficit space; no typed selection is required.
```

The disposition field belongs to the user. AI does not score, rank, or pre-resolve the choice. Free response preserves the user's implicit freedom to respond beyond any anticipated typed options — this freedom is inherent in conversation turn structure: gated does not mean unstructured; it means the user's response is constitutive (Rule 12 Recognition over Recall and Rule 14 Context-Question Separation, both inscribed in this SKILL.md).

### Phase 3: Route Integration

After user response (free-response utterance from Phase 2):

**Free-response parse**: Phase 3 resolves the utterance to the R coproduct constructor whose semantic intent most closely matches — affirmative adoption of a presented hypothesis routes to `Recognize`, alternative deficit/protocol nomination routes to `Redirect`, rejection of all hypotheses routes to `Dismiss`, scope restriction (situation slice or coverage subset) routes to `Narrow`, and exit signal routes to `Stop`. The presented hypotheses serve as the recognition substrate; no typed selection is required. When the utterance does not unambiguously resolve into a single constructor, Phase 3 issues one bounded re-prompt requesting clarification; persistent ambiguity after the bounded retry defaults to `Stop` to preserve the user's exit-without-disposition right.

**Disposition handling**:

- **Recognize**: Emit the recognized route as session text, carrying `target_coverage: Set(CoverageEntry)` — each entry pairs a deficit with its protocol, plus the supporting evidence and reverse-evidence. The user may invoke any subset of coverage protocols; the constituted recognition record covers the entire coverage set.
- **Redirect**: Record the user-named deficit/protocol as the recognized route. AI does not contest user redirection.
- **Dismiss**: Emit a short fit-review note recording that none of the presented hypotheses fit. No protocol is recommended.
- **Narrow scope** — branches by argument type (distinct semantics):
  - `Narrow(s: Slice)`: User restricts the situation scope (e.g., a specific decision, file, conversation slice). Rebind `U.session_slice ← s`, clear `Λ.dismissed_in_session` (new scope justifies fresh dismissals), and re-run Phase 1.
  - `Narrow(s: CoverageSubset)`: User restricts the protocol set of the selected hypothesis without changing situation scope. Write `Λ.coverage_constraint ← s`, preserve `Λ.dismissed_in_session` (situation unchanged), and re-run Phase 1 — Scan filters output to hypotheses whose coverage protocols intersect `s`. Compound-filter exhaustion: if `|H[]| < 2` cannot be satisfied after both `Λ.coverage_constraint` and `Λ.dismissed_in_session` filters apply, surface a fit-review note explaining the constraint combination and deactivate (explicit handling for the compound case; do not rely on the generic `narrow_iterations ≥ 3` exhaustion path alone).
- **Stop**: Deactivate without disposition.

No cumulative score, grade, or ranking is produced or stored across uses.

```
── FLOW ──
Probe(U) → Detect(U) →
  named_deficit(U): skip → deactivate
  vague_deficit(U): Scan(U, Catalog, Λ.coverage_constraint) → H[] →           -- each h ∈ H[] carries Set(CoverageEntry), |coverage|≥1
    |H[]| < 2: enrich Scan or expand Catalog window → re-scan
    |H[]| ≥ 2: present(H[]) → Qc(H[]) → Stop → utterance → parse → R →
        Recognize(h):     emit(ProtocolRoute(h.coverage)) → converge            -- target_coverage = h.coverage : Set(CoverageEntry)
        Redirect(d):      emit(ProtocolRoute(d)) → converge
        Dismiss:          emit(FitReviewNote(no_fit)) → converge
        Narrow(s: Slice): rebind(U.session_slice, s) → clear(Λ.dismissed_in_session) → Phase 1
                          -- new situation scope justifies clearing dismissals
        Narrow(s: CoverageSubset): write(Λ.coverage_constraint, s) → Phase 1
                          -- coverage filter only; situation scope unchanged; dismissals preserved
        Stop:             deactivate

── MORPHISM ──
UserSituation
  → detect(vague_deficit)             -- recognize that a deficit is implied but not named
  → scan(situation, Catalog, Λ.coverage_constraint)
                                      -- enumerate candidate hypotheses as Set(CoverageEntry); set-valued coverage
                                      --   (multi-protocol projection within a hypothesis is structurally distinct
                                      --    from inter-protocol composition defined in the COMPOSITION block)
  → present(H[], multi_hypothesis)    -- hypothesis surface IS the constitutive output; deficit-space disclosure precedes user judgment
  → recognize(h, user)                -- user adopts h.coverage as a whole; refinable via Narrow(CoverageSubset)
  → emit(ProtocolRoute | FitReviewNote)   -- ProtocolRoute carries target_coverage as Set(CoverageEntry)
  → ProtocolRoute | FitReviewNote
requires: vague_deficit(U)             -- activation precondition (Layer 1 only)
deficit:  DeficitUnrecognized          -- activation precondition
preserves: Catalog                     -- catalog read-only; U is rebindable on Narrow
invariant: Recognition over Resolution

── TYPES ──
U                = UserSituation { utterance: String, session_slice: Optional(Slice) }
Catalog          = Set(DeficitEntry)               -- 12 named deficits + Emergent
DeficitEntry     = { deficit: DeficitName, protocol: ProtocolId,
                     trigger_signal: String, reverse_evidence_template: String }
Evidence         = String                           -- quoted or paraphrased situation evidence
CoverageEntry    = { deficit: DeficitName, protocol: ProtocolId,
                     evidence: Evidence, reverse_evidence: Evidence }
                   -- per-protocol unit; deficit label is co-located with its protocol (no top-level deficit set)
Hypothesis       = { coverage: Set(CoverageEntry) } -- |coverage| ≥ 1
                   -- |coverage|=1: singleton hypothesis (single-protocol projection)
                   -- |coverage|≥2: set-valued coverage (multi-protocol projection within one hypothesis)
H[]              = List(Hypothesis)                 -- |H[]| ≥ 2 invariant
Scan             = (UserSituation, Catalog, Optional(Set(ProtocolId))) → H[]
                   -- third argument is Λ.coverage_constraint; when set, output is filtered to hypotheses
                   --   whose coverage protocol set intersects with the constraint
CoverageSubset   = Set(ProtocolId)                  -- 0 < |CoverageSubset| < |selected.coverage|
                   -- non-empty proper subset of a selected hypothesis's coverage protocols
Qc               = present hypothesis set with evidence and reverse-evidence;
                   free-response Constitution interaction (Phase 3 parses utterance into R)
R                = Recognition ∈ {Recognize(Hypothesis),                  -- adopts entire coverage
                                  Redirect(DeficitName | ProtocolId),
                                  Dismiss,
                                  Narrow(Slice | CoverageSubset),         -- distinct semantics per variant; see FLOW
                                  Stop}
ProtocolRoute    = session text { target_coverage: Set(CoverageEntry) }    -- |target_coverage| ≥ 1
                   -- recognized_deficits = π_deficit(target_coverage); evidence_trace = π_evidence(target_coverage)
                   --   (derived projections, not separate fields)
FitReviewNote    = session text { presented_hypotheses, dismissed: true }
DeficitName      ∈ {IntentMisarticulated, GoalIndeterminate, BoundaryUndefined,
                    ContextInsufficient, FrameworkAbsent, MappingUncertain,
                    AbstractionInProcess, GapUnnoticed, ExecutionBlind,
                    ApplicationDecontextualized, RecallAmbiguous, ResultUngrasped} ∪ Emergent
ProtocolId       ∈ {clarify, goal, bound, inquire, frame, ground,
                    induce, gap, attend, contextualize, recollect, grasp} ∪ Emergent
Phase            ∈ {0, 1, 2, 3}

── PHASE TRANSITIONS ──
Phase 0: U → Detect(U) → vague_deficit(U)?                          -- silent trigger detection
Phase 1: U → Scan(U, Catalog, Λ.coverage_constraint) → H[]          -- catalog scan; each h carries Set(CoverageEntry)
           Λ.coverage_constraint set → filter H[] to {h : π_protocol(h.coverage) ∩ Λ.coverage_constraint ≠ ∅}
           |H[]| < 2 → enrich(U) → Phase 1                          -- multi-hypothesis invariant
           |H[]| ≥ 2 → Phase 2
Phase 2: H[] → present(H[], evidence, reverse_evidence) → Qc(H[]) → Stop → utterance → parse → R   -- free-response Constitution interaction [Tool]
Phase 3: R → integrate(R, U) →
           Recognize(h)            → emit(ProtocolRoute(h.coverage)) → converge   -- target_coverage : Set(CoverageEntry)
           Redirect(d)             → emit(ProtocolRoute(d)) → converge            -- user-named alternative
           Dismiss                 → emit(FitReviewNote(no_fit)) → converge       -- no fit, recorded
           Narrow(s: Slice)        → rebind(U.session_slice, s) → clear(Λ.dismissed_in_session) → Phase 1
           Narrow(s: CoverageSubset) → write(Λ.coverage_constraint, s) → Phase 1  -- preserve dismissed_in_session
           Stop                    → deactivate                                    -- exit without disposition

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →
  Recognize: converge
  Redirect: converge
  Dismiss: converge
  Narrow(Slice): rebind U to narrower scope → Phase 1
  Narrow(CoverageSubset): apply coverage filter → Phase 1
  Stop: deactivate
Max 3 narrowing iterations. Exhausted: surface candidate set as fit-review note → deactivate.
Convergence evidence: per disposition, emit one of {ProtocolRoute, FitReviewNote} or deactivate without artifact (Stop).

── CONVERGENCE ──
recognized = R ∈ {Recognize(h), Redirect(d), Dismiss}
exhausted  = narrow_iterations ≥ 3
session_text(probe) ∋ {ProtocolRoute | FitReviewNote} (Stop deactivates without artifact)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect      (sense)    → Internal analysis (heuristic vague-deficit detection)
Phase 1 Scan        (sense)    → Internal analysis (catalog match against situation)
Phase 1 enrich      (sense)    → Internal analysis (situation broadening when |H[]| < 2)
Phase 2 Qc          (constitution)     → present (multi-hypothesis surface) + free-response receive (no typed option enumeration)
Phase 3 parse       (sense)        → Internal analysis (free-response utterance → R coproduct by semantic intent; bounded retry on ambiguous)
Phase 3 emit        (extension)    → TextPresent+Proceed (ProtocolRoute or FitReviewNote)
Phase 3 rebind      (track)    → Internal state update (Narrow(Slice) disposition — rebinds U.session_slice, clears Λ.dismissed_in_session)
Phase 3 write       (track)    → Internal state update (Narrow(CoverageSubset) disposition — sets Λ.coverage_constraint, preserves Λ.dismissed_in_session)
converge            (extension)    → TextPresent+Proceed (convergence trace)

── MODE STATE ──
Λ = { phase: Phase, U: UserSituation,
      hypotheses: List(Hypothesis), presented: Set(Hypothesis),
      dismissed_in_session: Set(Hypothesis),
      coverage_constraint: Optional(Set(ProtocolId)),   -- written by Narrow(CoverageSubset); consumed by Phase 1 Scan filter
      narrow_iterations: Nat,
      disposition: Optional(Recognition),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Probe composes downstream into the recognized protocol when the user selects Recognize or Redirect — composition target is determined at runtime by user disposition, not by static graph.json edges.
```

## Storage Reference

The hypomnesis sibling `misfit.md` sub-index (under `~/.claude/projects/{slug}/hypomnesis/{session-id}/`) is the designed-for read location for accumulated probe usage records — fit-review notes, recognized routes, and dismissed hypotheses. Probe reads this sub-index when available to enrich situation context. The writer mechanism is out of scope for this skill and is implemented separately at the substrate layer.

## Rules

1. **User-invoked only** — Probe activates only on explicit `/probe` invocation. AI auto-surfacing is structurally forbidden; Layer 1/Layer 2 separation is enforced.
2. **Opt-in, default off** — No sticky activation, no background scanning, no implicit re-activation across turns. The user explicitly activates each session.
3. **Current-session default scope** — Default evidence window is the present session. Cross-session evidence is opt-in only.
4. **All-time scope requires explicit confirmation** — Cross-session recall (reading prior `misfit.md` records or session history beyond the current session) requires an explicit Active-authority confirmation; never default behavior.
5. **Multi-hypothesis required** — Minimum two alternatives with distinct reverse-evidence conditions per hypothesis. Singleton high-confidence framing collapses Probe into Resolution; this is forbidden. Anti-singleton guard operates at hypothesis level (`|H[]| ≥ 2`). Each hypothesis carries set-valued coverage (`|coverage| ≥ 1`; `|coverage| ≥ 2` represents intra-hypothesis multi-protocol projection — structurally distinct from inter-protocol composition defined in the `── COMPOSITION ──` block). The reverse-evidence requirement applies per CoverageEntry within `Hypothesis.coverage`. **Two-level cardinality**: A single hypothesis with `|coverage| = 2` does NOT satisfy this guard — `|H[]| ≥ 2` requires at minimum two distinct Hypothesis records, each with its own coverage. The `|H[]| ≥ 2` guard operates on hypothesis count; `|coverage| ≥ 1` on per-hypothesis projection.
6. **Disposition field belongs to the user** — Recognize / Redirect / Dismiss / Narrow / Stop is a constitutive user act. AI never resolves the disposition unilaterally.
7. **No cumulative score / grade / ranking** — Across uses, no fitness metric, success rate, or aggregated quality score is produced or stored. Each probe is independent.
8. **Stop / Narrow / Dismiss always reachable via free response** — Stop, Narrow, and Dismiss are always available as user dispositions; they are reached through natural-language utterance (parsed by Phase 3 lexical patterns) rather than typed selection. Graceful exit and scope narrowing are always available — no typed dropdown is required to reach them.
9. **Blocked vocabulary** — The terms "wrong", "misuse detected", and "should have used" must not appear in Probe output. These vocabularies frame Probe as a corrective judge rather than a fit-review companion.
10. **Recommended vocabulary** — Use "fit review" as the positive framing replacement for the blocked vocabulary in #9. Output describes hypotheses, evidence, and reverse-evidence; never verdicts.
11. **Hypothesis form** — Each hypothesis is phrased as low-confidence dialogic: "N interpretations possible / decision point is X". Certainty framings ("clearly", "definitely", "the answer is") are forbidden.
12. **Recognition over Recall** — Present structured hypothesis options via Cognitive Partnership Move (Constitution) and yield turn. Each option carries differential reverse-evidence so the post-selection state is anticipatable.
13. **Detection with Authority** — AI detects candidate deficits with cited situation evidence; the user constitutes the recognition. AI never resolves the disposition.
14. **Context-Question Separation** — All hypothesis evidence and reverse-evidence is presented as text output before the gate. The gate contains only the disposition options.
15. **Convergence evidence** — Present a transformation trace before declaring convergence: Recognize/Redirect/Dismiss/Narrow produce a session-text artifact (ProtocolRoute or FitReviewNote); Stop deactivates without an artifact.
16. **Coexistence with /catalog and /onboard** — Probe does not replace passive reference (`/catalog`) or pattern-based recommendation (`/onboard`). The three skills occupy distinct stances.
17. **Structural-change calibration** — When a candidate hypothesis concerns whether a structural change crosses the architectural threshold, distinguish at hypothesis construction time:
    - **Architectural inscription**: addition of a new core protocol, addition of a `graph.json` edge, category-level promotion. Stage 2 deferral framing applies.
    - **Type-level realization**: type-level realization of an already-inscribed `── COMPOSITION ──` product within an existing protocol's operational scope. Evidence-collection modality internal iteration; Stage 2 deferral framing does not apply.
    The distinction informs `evidence` / `reverse_evidence` formulation when structural-change extent (line count, file count, scope size) is the apparent signal — extent alone does not determine architectural status. Maps to the surgical / design downstream-remediation classification axis carried by `docs/probe-verification-framework.md`: type-level realization ≅ surgical, architectural inscription ≅ design.

## UX Safeguards

- **Session immunity for dismissed hypotheses** — A hypothesis dismissed in the current session is not re-presented in the same session unless the user explicitly re-probes the same scope. Re-presenting a dismissed hypothesis without user-driven re-scope erodes the user's disposition authority (Rule 6 reinforcement). Realized via `Λ.dismissed_in_session`: Phase 3 Dismiss adds presented hypotheses to this set; Phase 1 Scan filters out members of this set. Clearing rules: `Narrow(Slice)` clears the set (new situation scope justifies fresh dismissals); `Narrow(CoverageSubset)` preserves the set (situation unchanged, only coverage filter applied).
- **Progress opacity** — No progress counter, no "X of Y hypotheses considered" framing. Such counters reintroduce a quasi-score (Rule 7 reinforcement).
- **Ephemeral recognition** — Each probe disposition is a present-tense fit review, not a permanent record. The user's disposition does not bind future probes (Rule 7 reinforcement).
- **Pre-gate evidence visibility** — All hypothesis evidence and reverse-evidence is laid out before the disposition gate so the user reads context before deciding (Rule 11 reinforcement; context-question separation is structural).
- **Vocabulary discipline** — Probe output uses "hypothesis", "fit review", "evidence", "reverse-evidence", "disposition", "route". The skill never speaks of mistakes, errors, or misuse (Rule 9 + Rule 10 reinforcement).

## Trigger Signals

Invoke `/probe` when:
- The user describes symptoms but cannot name a single protocol that fits
- The user is about to invoke a protocol but expresses uncertainty between two or more candidates
- The user asks "which one fits this?" without providing a specific deficit name
- The user wants a fit review before committing to a protocol invocation

## Skip Conditions

Skip Probe when:
- The user has already named the deficit with confidence
- The user requests a passive handbook reference (`/catalog`)
- The user requests pattern-based recommendation from session history (`/onboard`)
- The user requests accumulated analytics (`/report`, `/dashboard`)

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key | Deactivate Probe (ungraceful, no disposition record) |
| User utters Stop (parsed from free response) | Graceful exit without disposition |
| User utters Recognize / Redirect / Dismiss (parsed from free response) | Convergence with disposition record (ProtocolRoute or FitReviewNote) |
| Narrow iterations exhausted (3 max) | Surface candidate set as fit-review note → deactivate |
