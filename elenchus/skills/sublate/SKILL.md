---
name: sublate
description: "Vet working context by dialectical antithesis before action. Type: (ContextSuspect, User, VET, WorkingContext) → VettedContext. Alias: Elenchus(ἔλεγχος)."
---

# Elenchus Protocol

Vet working context by dialectical antithesis before action through structured per-source disposition judgment, resolving suspect context into vetted context. Type: `(ContextSuspect, User, VET, WorkingContext) → VettedContext`.

## Definition

**Elenchus** (ἔλεγχος): A dialogical act of cross-examination — from the Socratic refutation tradition meaning "testing by argument" — resolving suspect working context into vetted context through provenance challenge, counterfactual gap forecasting, cross-source consistency check, and inference-fallacy archetype scan before pre-execution sync. The protocol's lexical verb is `/sublate`. Each suspect source undergoes the motion of stating its current claim, surfacing what would shake it, and then deciding how to handle the source in light of that challenge (the Hegelian *Aufhebung* — preserve + negate + lift up — supplies the source vocabulary).

```
── FLOW ──
W → identify(W) → S_high →
  S_high = ∅: emit empty VettedContext (extension) → deactivate   -- trivial convergence (no audit-candidate source)
  S_high ≠ ∅: tag(provenance, freshness, leverage) → S' → posit(antithesis) → A[] →
  Q(per-source disposition slots) → J → integrate(J, S') → V →
  (loop if ∃ s : disposition(s) = Deferred ∧ trigger(s) met)

── MORPHISM ──
WorkingContext
  → identify(high_leverage_sources, S_high)    -- silent scan for sources warranting audit
  → tag(provenance, freshness, leverage)        -- attach metadata triple per source
  → posit(antithesis per source)                -- Pattern A ∪ Pattern B ∪ Pattern C ∪ Pattern D ∪ Emergent(Pattern)
  → present(antitheses, disposition slots)      -- per-source Constitution interaction
  → judge(disposition per source)                -- closed coproduct response
  → emit(VettedContext with disposition table)
  → VettedContext
requires: working_context_pre_execution_committed   -- runtime checkpoint (Phase 0)
deficit:  ContextSuspect                            -- activation precondition (Layer 1)
preserves: source_chain                              -- W.sources is read-only; antithesis and disposition annotate, never mutate
invariant: Dialectical Vetting over Silent Trust

── TYPES ──
W              = WorkingContext { sources: List(Source), action: Prospect }
Source         = { content: String, origin: Origin, observed_at: Timestamp, downstream: List(Reference) }
Origin         ∈ {UserStatement, DocumentRead, ToolOutput, AIInference, ExternalAPI, PastSession} ∪ Emergent(Origin)
identify       = WorkingContext → Set(Source)            -- silent selection per Source Identification Criteria
S_high         = Set(Source)                              -- audit-candidate set; cardinality 0 yields trivial convergence
ClaimRef       = { referent: String, claim_kind: String, scope: String, text: String }
               -- claim_kind = the SEMANTIC CATEGORY of claim the source is tested as authority for (a distinct axis from an evidence-channel kind); values are protocol-local (self-contained, no shared cross-protocol enum). text = claim verbatim, used by Pattern A's cite-claim-verbatim test
ProvenanceTag  = { source: Source, claim: ClaimRef, evidence: VerificationPath, confidence: Float }
               -- claim-relative tag: the source's authority is recorded for the claim it authorizes, not for the source in general
VerificationPath ∈ {DirectObserved, InferredFromN, ExternalCited, ProvisionalAssumption}
FreshnessTag   = { source: Source, age: Duration, horizon: Duration, stale: Bool }
               -- currency only: a source can be fresh yet still not track the behavior its claim asserts (it documents intent with nothing enforcing the match). Freshness is necessary but not sufficient for trusting a source; the support-integrity challenge is posited per source in Pattern A (Source Provenance Audit).
LeverageTag    = { source: Source, downstream_count: Nat, branches: Set(Reference) }
S'             = Map(Source, ProvenanceTag × FreshnessTag × LeverageTag)
Pattern        ∈ {ProvenanceAudit, CounterfactualGap, CrossSourceConsistency, InferenceFallacyAudit} ∪ Emergent(Pattern)
Antithesis     = { source: Source, pattern: Pattern, thesis: String, antithesis: String, basis: String }
A[]            = List(Antithesis)
Disposition    = Confirmed                                   -- assumption survived antithesis
               | Revised(refinement: String)                 -- assumption updated per antithesis
               | Discarded(reason: String)                   -- assumption withdrawn
               | Deferred(re_trigger_condition: String)      -- next iteration on trigger
               | Conditional(measurement: String)            -- pending external measurement
               | Bounded(external_reference: String)         -- routed to other source-of-truth
               | Routed(downstream_protocol: ProtocolId)     -- handed off to a different protocol
Qs             = Per-source disposition gate
J              = Map(Source, Disposition)
V              = VettedContext { dispositions: J, trace: Map(Source, Antithesis) }
trigger_met(c)        = Bool                                                                            -- evaluator: true when a Deferred re_trigger_condition c is now satisfied at the LOOP scan
unresolved(Λ)         = {s ∈ S_high | s ∉ dom(Λ.dispositions) ∨ (∃c. Λ.dispositions(s) = Deferred(c) ∧ trigger_met(c))}   -- sources still requiring judgment: unjudged, or Deferred whose trigger has fired (re-vetting due); an untriggered Deferred is resolved (vetted-compatible), not pending
vetted(V)      = dom(J) = S_high ∧ ∀ s ∈ S_high : ¬(∃c. J(s) = Deferred(c) ∧ trigger_met(c))
VettedContext  = V where vetted(V)
EarlyExit      = V where user_esc ∨ user_cancel  -- non-convergent early exit: V as of exit (dispositions/trace = judgments recorded so far, empty when exit precedes the first judged batch); working context remains un-vetted (or partially vetted under user_cancel); unresolved sources (unresolved(Λ): unjudged, or Deferred whose trigger has fired) declared as unresolved residual

── PHASE TRANSITIONS ──
Phase 0: W → identify(W) → S_high                                       -- silent scan (no user interaction)
Phase 0 → converge (trivial): S_high = ∅ → emit empty VettedContext (dispositions = ∅, trace = ∅) as relay, deactivate   -- trivial convergence (TYPES: cardinality 0; no audit-candidate source)
Phase 0 → Phase 1: S_high ≠ ∅
Phase 1: S_high → Step₁ tag(provenance, freshness, leverage) → S'       [Tool: Read, Grep]
         Step₂ posit(antithesis per s ∈ S') → A[]                        -- per-source Pattern A ∪ B ∪ C ∪ D ∪ Emergent(Pattern) generation
Phase 2: (A[], disposition slots) → Qs(per-source) → Stop → J            [Tool: Constitution interaction]
Phase 3: J → integrate(J, S') → V                                        -- per-source disposition recorded

── LOOP ──
After Phase 3: scan for Deferred dispositions whose re_trigger_condition is met.
If ∃ s : J(s) = Deferred(c) ∧ trigger_met(c): return to Phase 1 with s as fresh ContextSuspect; new antithesis under updated evidence.
If all dispositions resolved (no Deferred or all triggers unmet): terminate with VettedContext.
User can exit at Phase 2 (user_esc).
Continue until: vetted(V) OR user_esc/user_cancel (EarlyExit, not VettedContext).
Convergence evidence: At vetted(V), present transformation trace — for each s ∈ S_high, show (s → antithesis(s) → disposition(s)). Convergence is demonstrated, not asserted.
On user_esc/user_cancel: present partial trace over judged sources (s → antithesis(s) → disposition(s) for each judged s), then declare unresolved(Λ) sources in S_high (unjudged, or Deferred whose trigger has fired — re-vetting due at exit) as unresolved residual.

── CONVERGENCE ──
vetted(V): see TYPES
progress(Λ) = 1 if |S_high| = 0 else 1 - |unresolved(Λ)| / |S_high|   -- S_high = ∅ (Phase 0 trivial convergence, no audit-candidate source) is fully converged, not undefined; progress = 1 coincides with vetted(V)
early_exit = user_esc ∨ user_cancel

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 identify        (sense)        → Internal analysis (high-leverage / age / chain / contradiction / inference-character scan)
Phase 0 trivial_converge (extension)   → TextPresent+Proceed (conditional: S_high = ∅ — relay the empty VettedContext, no audit-candidate source; deactivate)
Phase 1 ProvenanceTag   (observe)      → Read, Grep (verification of source origin, authorized claim, and downstream references)
Phase 1 AntithesisPosit (sense)        → Internal analysis (Pattern A/B/C/D/Emergent antithesis generation per source)
Phase 2 Qs              (constitution) → present (mandatory; per-source disposition slots; Esc → loop termination at LOOP level, not a Disposition)
Phase 3 integrate       (track)        → Internal state update (Λ.dispositions, Λ.history)
converge                (extension)    → TextPresent+Proceed (per-source disposition trace; proceed with VettedContext)
esc/cancel              (extension)    → TextPresent+Proceed (partial per-source disposition trace + unresolved-source residual declaration (unresolved(Λ)); terminate as EarlyExit, not VettedContext)

── MODE STATE ──
Λ = {
  phase: Phase,
  W: WorkingContext,
  S_high: Set(Source),
  tagged: Map(Source, ProvenanceTag × FreshnessTag × LeverageTag),
  antitheses: Map(Source, Antithesis),
  dispositions: Map(Source, Disposition),
  history: List<(Source, Antithesis, Disposition)>,
  active: Bool,
  cause_tag: String
}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Pattern resolution emergent via session context.
```

## Core Principle

**Dialectical Vetting over Silent Trust**: Working context accumulated across a session carries silent decay — sources age, provenance chains lengthen, downstream concentration warps incidental claims into load-bearing premises, and cross-source contradictions hide behind topical proximity. Elenchus surfaces each suspect source against a deliberately posited antithesis before action; the user judges each disposition per source. The loop dissolves compounding context cost before it forces whole-system refactoring downstream.

## Mode Activation

### Activation

Command invocation activates mode until per-source disposition is judged for all audit-candidate sources.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/sublate` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. The user signals awareness that the working context warrants vetting before commit-to-action (deploy, deposit, external sync, merge).

The User-initiated stance is calibrated: AI auto-detection of "this context smells stale" carries a false-positive cost (interrupting flow with low-confidence vetting prompts) that outweighs its savings (the user already knows when they are about to externalize and is best positioned to invoke).

### Priority

<system-reminder>
When Elenchus is active:

**Supersedes**: Direct execution patterns that proceed without per-source disposition judgment
(Working context must be vetted source-by-source via Cognitive Partnership Move (Constitution), not assumed silently)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present per-source disposition slots with antithesis evidence via Cognitive Partnership Move (Constitution).
</system-reminder>

- Elenchus completes before action dependent on the vetted context proceeds
- Loaded instructions resume after vetting or Esc

### Triggers

| Signal | Detection |
|--------|-----------|
| Pre-sync commit | User signals upcoming externalization of working context (meeting share, PR push, deploy, deposit) |
| Long-collected context | User signals duration concern about accumulated context |
| Provenance concern | User questions verification status of a specific source |
| Counterfactual concern | User varies a current condition and asks whether downstream still holds |
| Cross-source friction | User notices two collected sources pointing at the same referent diverging |
| Inference-soundness concern | User questions whether a conclusion's reasoning holds rather than the source it cites |

**Qualifying condition**: Activate only when working context exists and the user signals an upcoming pre-execution sync or externalization. The protocol does not activate on freshly-arrived context with no audit-candidate sources — the silent scan at Phase 0 yields S_high = ∅, which converges trivially.

**Skip**:
- Working context is empty or just-arrived (no high-leverage / aged / inferred / contradicting source)
- User already invoked `/inquire` or `/elicit` on the same working context within the same session and no new sources have accumulated
- The action under consideration is itself a Phase 0 silent scan (vetting before vetting recurses without termination)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All dispositions resolved (no Deferred or all triggers unmet) | Emit VettedContext, proceed |
| Phase 0 scan yields S_high = ∅ | Emit empty VettedContext trivially (relay), deactivate |
| User Esc | Return to normal operation; working context remains un-vetted |
| User explicitly cancels mid-loop | Accept partial vetting; remaining sources annotated as un-vetted in trace |

## Source Identification Criteria

User-initiated activation triggers Phase 0's silent scan. The scan does not gate activation — its purpose is to *select which sources within the committed working context warrant audit*. The five criteria below guide source selection; sources matching one or more enter S_high.

| Criterion | Condition | Pattern Hint |
|-----------|-----------|--------------|
| High-leverage accumulation | A single source carries downstream weight beyond a working threshold (downstream_count ≥ 3 is the current working hypothesis) — multiple decisions, sub-plans, or commit paths depend on it | Pattern A (provenance) |
| Source age beyond horizon | Source's `observed_at + horizon(origin)` < now; horizon varies by origin (UserStatement and ToolOutput have shorter horizons than DocumentRead and PastSession) | Pattern A or B |
| Provenance-chain length | The belief depends on an N-step inference chain rather than direct observation, citation, or measurement | Pattern A (provenance) |
| Cross-source contradiction | Two collected sources nominally pointing at the same referent diverge in their content or implication | Pattern C (cross-source consistency) |
| Inference-character conclusion | The source is itself a conclusion reached by inference (origin `AIInference`, or a conclusion beginning to function as a standing premise) | Pattern D (inference fallacy) |

`N` (high-leverage threshold) and horizon defaults per origin are residual variables refined through accumulated use evidence. The five criteria are working hypotheses, not closed; an Emergent criterion may surface on use.

## Patterns

Four patterns are inscribed. Each pattern pairs a current claim with a challenge that would shake it; the AI surfaces both at Phase 1 Step 2 per source, and the user decides how to handle the source at Phase 2. A further Emergent pattern is permitted but not pre-named — it must satisfy `ContextSuspect → VettedContext` (the challenge must directly confront the source's claim, not stand as a side verification check).

Patterns A, B, and C vet a source along the **source-vetting axis** (provenance authority, counterfactual robustness, cross-source agreement). Pattern D vets along the **reasoning axis** — whether the inference that produced a conclusion is itself sound — complementing the source-vetting patterns so that the inference, not only its source, is examined.

### Pattern A — Source Provenance Audit

When a source claims authority, the challenge asks whether that authority is actually verified for the claim it is grounding.

- The source's current claim: "Source X is verified for claim C in the domain it claims to ground."
- What would shake it: "Source X's verification path authorizes a different claim, is provisional, inferred, cited but unread, or stale — or X is fresh and present yet nothing actually ties it to the behavior it claims, so it could have quietly drifted out of agreement (ask: if that behavior changed today, would X break or fail, or stay unchanged and silently wrong?). A source that only documents intended behavior, with nothing enforcing the match, is not settled by freshness alone."
- The user decides how to handle the source: keep the source as-is, rewrite the claim with a refinement, withdraw the source, wait for an external measurement to settle the question, or treat an outside source-of-truth as the authoritative reference for the claim.

### Pattern B — Counterfactual Gap Forecasting

When a source supports a conclusion under current conditions, the challenge changes the condition and asks whether the conclusion still stands.

- The source's current claim: "Y holds in the current working context."
- What would shake it: "If Z replaces a current condition, a gap opens at point P — does Y still hold?"
- The user decides how to handle the source: keep the source as-is, rewrite the claim with a refinement, set the source aside until condition Z appears again, or hand the question off to another protocol.

### Pattern C — Cross-Source Consistency Check

When two sources point at the same referent but diverge, the challenge forces an explicit reconciliation of referent and claim-kind. Candidate pairs are enumerated over sources SHARING THE SAME referent (not all pairwise combinations); for each such pair, claim-kind compatibility is tested before a divergence is flagged.

- The sources' current claim: "Sources X₁ and X₂ refer to the same referent and compatible claim-kind consistently."
- What would shake it: "X₁'s claim and X₂'s claim diverge at point Q — which source is authoritative for this claim, and what reconciles the divergence?"
- The user decides how to handle the sources: keep the sources as-is, rewrite the claim with a refinement, withdraw one of the sources, treat an outside source-of-truth as the authoritative reference, or hand the question off to another protocol.

### Pattern D — Inference Fallacy Audit

When a source is itself a conclusion reached by inference — an `AIInference` origin, or any conclusion that is starting to be used as a standing premise — the challenge tests whether the conclusion's validity depends on a reasoning flaw rather than on the source it cites. The AI reverse-derives the flaw condition from a reasoning-fallacy archetype, instead of waiting for the user to supply a counter-condition.

- The source's current claim: "Conclusion Y follows soundly from the basis observed."
- What would shake it: "Y's validity rests on a reasoning archetype that does not hold." The archetype is described as a principle, not selected from a closed list: does the conclusion treat a point-in-time observation as a time-invariant law (a present coincidence read as permanent truth); generalize a standing rule from one or few observations; conclude from only the visible (surviving) sample; draw a conclusion that ignores the base rate; or read correlation as cause. These archetypes are a starting set for recognition, not an exhaustive catalog — an Emergent fallacy archetype is admitted whenever a conclusion's soundness rests on a reasoning move not named here.
- The user decides how to handle the source: keep the conclusion as-is, rewrite it with its scope made conditional (the inference holds only within the stated bounds), withdraw the conclusion, set it aside until a measurement settles it, or hand the question off to another protocol.

**Boundary with Pattern B**: Pattern B is a counterfactual the *user* frames — the user supplies condition Z and asks whether Y still holds. Pattern D is the AI *reverse-deriving* the flaw condition from a fallacy archetype, moving the discovery burden from the AI happening to pick the right counterfactual to an archetype-driven scan of the inference itself. A conclusion can pass Pattern B (no user-supplied condition shakes it) yet fail Pattern D (its soundness silently depends on treating the present as invariant).

## Protocol

### Phase 0: Source Identification (Silent)

Analyze the working context and select audit-candidate sources. This phase is silent — no user interaction.

1. **Bind W**: the working context committed in the session — sources, claims, downstream references, and the pre-execution action under consideration
2. **Apply Source Identification Criteria**: scan each source for high-leverage accumulation, age beyond horizon, provenance-chain length, cross-source contradiction, and inference-character conclusion
3. **Compose S_high**: the union of sources matching at least one criterion
4. If S_high = ∅: emit empty VettedContext trivially and deactivate (no audit-candidate sources warrant vetting)
5. If S_high ≠ ∅: proceed to Phase 1

**Scope restriction**: Phase 0 is silent. Does NOT modify files, call external services, or alter session state.

### Phase 1: Tagging and Antithesis Generation

Generate metadata triple plus dialectical antithesis per source.

**Step 1 — Tagging**: For each `s ∈ S_high`, attach ProvenanceTag (authorized claim + verification path + confidence), FreshnessTag (age, horizon, stale flag), and LeverageTag (downstream_count, branches). Use Read and Grep to verify provenance against the source's claimed origin where the source's content cites verifiable artifacts. The ProvenanceTag binds authority to the claim's referent, claim_kind, and scope; reuse of the same source as authority for a different claim must surface through Pattern A or Pattern C rather than silently carrying over. For an audit-candidate source, provenance verification also asks whether the source actually tracks the behavior its claim asserts or merely documents it — a source that is fresh yet not tied to that behavior is posited against in Pattern A on that basis, not cleared by its freshness verdict alone. When enforcement coupling cannot be determined from the available tools, posit the gap as a Pattern A antithesis candidate with basis "enforcement coupling not observable from available tools" — neither skip it silently nor assert coupling with false confidence.

**Step 2 — Antithesis positing**: For each tagged source, select the most applicable pattern (A, B, C, D, or Emergent) and construct an antithesis. A source that is itself an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise) is a candidate for Pattern D, where the antithesis reverse-derives the inference's flaw condition from a fallacy archetype rather than from a user-supplied counter-condition. The antithesis must:
- Cite the source's claim verbatim, anchored to the originating sentence or artifact
- Name the dialectical challenge concretely (a verification gap, a counterfactual condition, a divergent sibling source, or an inference-fallacy archetype condition)
- Surface the basis for the challenge so the user can recognize the antithesis's evidence

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 1 pattern selection; the constitutive judgment remains with the user.

### Phase 2: Per-Source Disposition Constitution Interaction

Present antitheses and disposition slots via Cognitive Partnership Move (Constitution). Constitution presentation yields turn for user response.

**Pre-gate text output** (Context-Question Separation): For each source in S_high, present as text output:
- The source's content (verbatim or close paraphrase)
- The tagging triple (provenance verdict, freshness verdict, leverage count)
- The selected pattern (A, B, C, D, or Emergent) with its thesis ↔ antithesis pair
- The basis cited for the antithesis

Then present a per-source disposition interaction. Each source receives its own slot; batching across sources is permitted when slot count ≤ 4, otherwise process sources in batches of up to 4.

```
For each batch of up to 4 sources, present:

question: "Disposition for source [N]: [brief source identifier]"
options:
  - label: "Confirmed"
    description: "Antithesis examined; the original claim survives. Downstream usage proceeds as-is."
  - label: "Revised([refinement])"
    description: "Antithesis surfaces a concrete update; the claim is rewritten in the working context. Downstream usage proceeds against the refined form."
  - label: "Discarded([reason])"
    description: "Antithesis defeats the claim; the source is withdrawn from the working context. Downstream usage must re-derive without it."
  - label: "Deferred([re_trigger_condition])"
    description: "Disposition pending; the loop returns to this source when the named condition is met. Downstream usage proceeds without commitment until re-evaluation."
  - label: "Conditional([measurement])"
    description: "Disposition pending external measurement; downstream usage tags the source as provisional until the measurement resolves."
  - label: "Bounded([external_reference])"
    description: "The authoritative answer lives outside this session; downstream usage cites the external reference rather than the in-session source."
  - label: "Routed([downstream_protocol])"
    description: "The challenge belongs to a different protocol family — handed off to the appropriate downstream protocol for resolution."
Other: user composes a free-response disposition; AI maps the response to the closest coproduct variant or surfaces an Emergent disposition candidate.
```

**Option budget**: 4 sources per Constitution interaction is the working ceiling. When |S_high| > 4, sources are batched in groups of 4; each batch is its own Constitution interaction with its own Stop.

### Phase 3: Disposition Integration

After each Constitution interaction returns J, integrate into Λ.dispositions and Λ.history. No user-facing action — internal state update only.

If all sources in S_high are now in J: proceed to LOOP evaluation.
If sources remain unjudged across batches: return to Phase 2 with the next batch.

## Convergence Evidence

At vetted(V), present the transformation trace before declaring convergence. For each `s ∈ S_high`:

```
[Source identifier]
  Pattern: A | B | C | D | Emergent(name)
  Antithesis: [concrete antithesis text]
  Disposition: [chosen variant with parameters]
```

Present transformation trace as text output, then proceed with the vetted context. The relay presentation does not gate; it demonstrates the completed morphism.

## Rules

1. **User-initiated only**: Activate only when the user signals an upcoming pre-execution sync over an existing working context. No AI-guided Layer 2 activation; the deficit-awareness sits with the user.
2. **Recognition over Recall**: Present per-source disposition slots with differential implications via Cognitive Partnership Move (Constitution); the user evaluates structured options rather than recalling them from memory. Constitution interaction yields turn before proceeding.
3. **Context-Question Separation**: Each source's content, tagging triple, pattern, and antithesis basis appear as text output preceding the Constitution interaction; the question contains only the source identifier and the seven disposition options with their differential implications.
4. **Detection with authority**: AI detects audit-candidate sources, posits antitheses, and surfaces basis; the user judges each disposition. Detection is the AI's responsibility; judgment is the user's right.
5. **Surfacing over Deciding**: Per-source antithesis is surfaced with cited basis; AI does not silently downgrade or resolve a source's disposition. A source whose antithesis the AI cannot construct concretely is surfaced as such, not skipped.
6. **Convergence evidence**: Present transformation trace (source → antithesis → disposition) before declaring all sources vetted; per-source evidence is required, not asserted.
7. **Source chain preservation**: W.sources is read-only across the protocol's lifetime. Antithesis and disposition annotate, never mutate, the source list. A Discarded disposition removes a source from downstream usage but preserves it in Λ.history with its withdrawal reason.
8. **Loop continuity under bounded regret**: Deferred dispositions whose re-trigger condition has not been met let the loop continue. Only dispositions requiring genuinely viable alternative judgment paths — where the user's values determine the choice among options (Constitution-level entropy > 0) — warrant Phase 2 surfacing; relay-level operations (tagging, antithesis text construction, trace presentation) proceed inline.
9. **Antithesis must be dialectical**: An antithesis names a concrete counter-claim (Pattern A: "X is unverified"), counter-condition (Pattern B: "in condition Z, Y fails"), counter-source (Pattern C: "X₁ and X₂ diverge at Q"), or counter-inference (Pattern D: "Y's soundness rests on a fallacy archetype that fails here"). Procedural queries ("have you checked X?") surface in `/inquire` or `/attend`, not here.
10. **Closed coproduct discipline**: Disposition is a closed coproduct of seven named variants plus Emergent. The Other option permits free-response, which the AI maps to the closest variant or surfaces as a candidate Emergent variant for that source — it does not bypass the coproduct.
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic disposition variant into a concrete instance with parameters while preserving the TYPES coproduct structure) is distinct from mutation.
12. **Substrate boundary**: Elenchus scope is the epistemic substrate — source identification, antithesis positing, disposition surfacing, and integration through Phase 0 to Phase 3. Post-vetting execution (the downstream action's substrate enforcement, harness permission, network/state mutation) belongs to native harnesses or specialized substrates, delegated by handoff after Phase 3 integration.
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Claim-relative provenance**: ProvenanceTag records the claim a source authorizes. Pattern A tests source authority against that claim; Pattern C enumerates candidate pairs over same-referent sources, then tests cross-source consistency only after referent and claim-kind compatibility are explicit. The tag classifies and surfaces the issue; disposition remains the user's Constitution judgment.
16. **Currency is not support-integrity**: A source that is fresh and present is not thereby trusted — freshness is necessary but not sufficient for the claim a source grounds. When a source is current yet nothing ties it to the behavior its claim asserts, Pattern A must posit that gap as the antithesis (would the source break or fail if that behavior changed, or stay unchanged and silently wrong?) and surface it with cited basis; the full disposition coproduct stays available and the user constitutes the disposition, recording the basis on which freshness was or was not enough. The AI surfaces the support-integrity challenge; it does not decide it.
17. **Inference-fallacy archetypes are principle, not closed catalog**: Pattern D seeds its antithesis from reasoning-fallacy archetypes stated as principles — the named archetypes (a present coincidence read as permanent truth, generalizing from few observations, surviving-sample-only reading, base-rate neglect, correlation-as-cause) are a starting set for recognition, never a closed enumeration, and an Emergent archetype is admitted whenever a conclusion's soundness rests on an unnamed reasoning move. Pattern D differs from Pattern B by direction: B vets a user-supplied counter-condition; D reverse-derives the flaw condition from an archetype, moving the discovery burden off the AI happening to pick the right counterfactual. A source qualifies for Pattern D when it is an inferred conclusion (origin `AIInference`, or a conclusion functioning as a standing premise); because sublate's unit is already `Source`, this is a pattern, not a new protocol.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
