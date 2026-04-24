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

Scan the user's situation against the full catalog of 12 epistemic deficits. For each candidate deficit, gather:

- The deficit name and matching protocol
- Concrete situation evidence (what the user said or did that suggests this deficit)
- A reverse-evidence condition: what observation would refute this hypothesis

Construct the candidate set. Keep at minimum two candidates with non-overlapping reverse-evidence conditions — singleton high-confidence framing is forbidden (see Rules section, Rule 5).

### Phase 2: Hypothesis Presentation

Present the candidate hypotheses as text output before the gate. Format per hypothesis:

```
Hypothesis N — N interpretations possible / decision point is X
  Deficit: <DeficitName> (<protocol>)
  Evidence: <quote or paraphrase of user's situation>
  Reverse-evidence: <observation that would refute this hypothesis>
```

Then present the recognition gate:

```
Which hypothesis fits your present situation?

Options:
1. Recognize (Hypothesis 1 / 2 / N) — proceed to /<protocol>
2. Redirect — name a different deficit or protocol than presented
3. Dismiss — none of these fit; continue without protocol invocation
4. Narrow scope — restrict to a specific concern before re-probing
5. Stop — exit /probe without disposition
```

The disposition field belongs to the user. AI does not score, rank, or pre-resolve the choice.

### Phase 3: Route Integration

After user response:

- **Recognize**: Emit the recognized deficit + protocol route as session text. The user now has a constituted recognition record they can act on (e.g., invoke `/<protocol>` directly).
- **Redirect**: Record the user-named deficit/protocol as the recognized route. AI does not contest user redirection.
- **Dismiss**: Emit a short fit-review note recording that none of the presented hypotheses fit. No protocol is recommended.
- **Narrow scope**: User narrows the scope (e.g., a specific decision, file, conversation slice) and Phase 1 re-runs over the narrowed scope.
- **Stop**: Deactivate without disposition.

No cumulative score, grade, or ranking is produced or stored across uses.

```
── FLOW ──
Probe(U) → Detect(U) →
  named_deficit(U): skip → deactivate
  vague_deficit(U): Scan(U, Catalog) → H[] →
    |H[]| < 2: enrich Scan or expand Catalog window → re-scan
    |H[]| ≥ 2: present(H[]) → Qc(H[], evidence, reverse_evidence) → Stop → R →
      Recognize(h): emit(ProtocolRoute(h)) → converge
      Redirect(d): emit(ProtocolRoute(d)) → converge
      Dismiss: emit(FitReviewNote(no_fit)) → converge
      Narrow(s): rebind(U, s) → Phase 1
      Stop: deactivate

── MORPHISM ──
UserSituation
  → detect(vague_deficit)             -- recognize that a deficit is implied but not named
  → scan(situation, Catalog)          -- enumerate candidate deficits with evidence + reverse-evidence
  → present(H[], multi_hypothesis)    -- minimum two hypotheses, falsification visible
  → recognize(h, user)                -- user-constituted recognition (synthesis of identification)
  → emit(ProtocolRoute | FitReviewNote)
  → ProtocolRoute
requires: vague_deficit(U)             -- activation precondition (Layer 1 only)
deficit:  DeficitUnrecognized          -- activation precondition
preserves: Catalog                     -- catalog read-only; U is rebindable on Narrow
invariant: Recognition over Resolution

── TYPES ──
U                = UserSituation { utterance: String, session_slice: Optional(Slice) }
Catalog          = Set(DeficitEntry)               -- 12 named deficits + Emergent
DeficitEntry     = { deficit: DeficitName, protocol: ProtocolId,
                     trigger_signal: String, reverse_evidence_template: String }
Hypothesis       = { deficit: DeficitName, protocol: ProtocolId,
                     evidence: String, reverse_evidence: String }
H[]              = List(Hypothesis)                 -- |H[]| ≥ 2 invariant
Scan             = (UserSituation, Catalog) → H[]
Qc               = present hypothesis set with evidence and reverse-evidence; gate
R                = Recognition ∈ {Recognize(Hypothesis), Redirect(DeficitName | ProtocolId),
                                  Dismiss, Narrow(Slice), Stop}
ProtocolRoute    = session text { recognized_deficit, target_protocol, evidence_trace }
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
Phase 1: U → Scan(U, Catalog) → H[]                                 -- catalog scan
           |H[]| < 2 → enrich(U) → Phase 1                          -- multi-hypothesis invariant
           |H[]| ≥ 2 → Phase 2
Phase 2: H[] → present(H[], evidence, reverse_evidence) → Qc → Stop → R   -- recognition gate [Tool]
Phase 3: R → integrate(R, U) →
           Recognize(h) → emit(ProtocolRoute(h)) → converge          -- user-constituted route
           Redirect(d)  → emit(ProtocolRoute(d)) → converge          -- user-named alternative
           Dismiss      → emit(FitReviewNote(no_fit)) → converge     -- no fit, recorded
           Narrow(s)    → rebind(U, s) → Phase 1                     -- scope-narrowed re-scan
           Stop         → deactivate                                  -- exit without disposition

── LOOP ──
Phase 1 → Phase 2 → Phase 3 →
  Recognize: converge
  Redirect: converge
  Dismiss: converge
  Narrow: rebind U to narrower scope → Phase 1
  Stop: deactivate
Max 3 narrowing iterations. Exhausted: surface candidate set as fit-review note → deactivate.
Convergence evidence: per disposition, emit one of {ProtocolRoute, FitReviewNote} or deactivate without artifact (Stop).

── CONVERGENCE ──
recognized = R ∈ {Recognize(h), Redirect(d), Dismiss}
exhausted  = narrow_iterations ≥ 3
session_text(probe) ∋ {ProtocolRoute | FitReviewNote} (Stop deactivates without artifact)

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Detect      (sense)    → Internal analysis (heuristic vague-deficit detection)
Phase 1 Scan        (sense)    → Internal analysis (catalog match against situation)
Phase 1 enrich      (sense)    → Internal analysis (situation broadening when |H[]| < 2)
Phase 2 Qc          (gate)     → present (multi-hypothesis recognition gate)
Phase 3 emit        (relay)    → TextPresent+Proceed (ProtocolRoute or FitReviewNote)
Phase 3 rebind      (track)    → Internal state update (Narrow disposition)
converge            (relay)    → TextPresent+Proceed (convergence trace)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 2 Qc (recognition)     → always_gated (constitutive user act; Standing-authority delegation forbidden)

── MODE STATE ──
Λ = { phase: Phase, U: UserSituation,
      hypotheses: List(Hypothesis), presented: Set(Hypothesis),
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
5. **Multi-hypothesis required** — Minimum two alternatives with distinct reverse-evidence conditions per hypothesis. Singleton high-confidence framing collapses Probe into Resolution; this is forbidden.
6. **Disposition field belongs to the user** — Recognize / Redirect / Dismiss / Narrow / Stop is a constitutive user act. AI never resolves the disposition unilaterally.
7. **No cumulative score / grade / ranking** — Across uses, no fitness metric, success rate, or aggregated quality score is produced or stored. Each probe is independent.
8. **Stop / Narrow / Dismiss always present** — Stop, Narrow, and Dismiss options appear at every gate, matching the Phase 2 disposition labels. Three-Tier Termination inheritance: graceful exit is always available.
9. **Blocked vocabulary** — The terms "wrong", "misuse detected", and "should have used" must not appear in Probe output. These vocabularies frame Probe as a corrective judge rather than a fit-review companion.
10. **Recommended vocabulary** — Use "fit review" as the positive framing replacement for the blocked vocabulary in #9. Output describes hypotheses, evidence, and reverse-evidence; never verdicts.
11. **Hypothesis form** — Each hypothesis is phrased as low-confidence dialogic: "N interpretations possible / decision point is X". Certainty framings ("clearly", "definitely", "the answer is") are forbidden.
12. **Recognition over Recall** — Present structured hypothesis options via gate interaction and yield turn. Each option carries differential reverse-evidence so the post-selection state is anticipatable.
13. **Detection with Authority** — AI detects candidate deficits with cited situation evidence; the user constitutes the recognition. AI never resolves the disposition.
14. **Context-Question Separation** — All hypothesis evidence and reverse-evidence is presented as text output before the gate. The gate contains only the disposition options.
15. **Convergence evidence** — Present a transformation trace before declaring convergence: Recognize/Redirect/Dismiss/Narrow produce a session-text artifact (ProtocolRoute or FitReviewNote); Stop deactivates without an artifact.
16. **Coexistence with /catalog and /onboard** — Probe does not replace passive reference (`/catalog`) or pattern-based recommendation (`/onboard`). The three skills occupy distinct stances.

## UX Safeguards

- **Session immunity for dismissed hypotheses** — A hypothesis dismissed in the current session is not re-presented in the same session unless the user explicitly re-probes the same scope. Re-presenting a dismissed hypothesis without user-driven re-scope erodes the user's disposition authority (Rule 6 reinforcement).
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
| User selects Stop | Graceful exit without disposition |
| User selects Recognize / Redirect / Dismiss | Convergence with disposition record (ProtocolRoute or FitReviewNote) |
| Narrow iterations exhausted (3 max) | Surface candidate set as fit-review note → deactivate |
