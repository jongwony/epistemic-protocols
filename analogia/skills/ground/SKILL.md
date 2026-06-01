---
name: ground
description: "Validate structural mapping between abstract and concrete domains. Constructs domain correspondences and presents concrete instantiations when mapping uncertainty is detected, producing validated mapping. Type: (MappingUncertain, AI, GROUND, R) → ValidatedMapping. Alias: Analogia(ἀναλογία)."
---

# Analogia Protocol

Validate structural mapping between abstract and concrete domains through AI-guided detection and user-validated instantiation. Type: `(MappingUncertain, AI, GROUND, R) → ValidatedMapping`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of validating structural correspondences between domains, where AI detects mapping uncertainty between abstract frameworks and concrete application contexts, constructs explicit structural mappings, and presents concrete instantiations for user verification of mapping adequacy.

```
── FLOW ──
Analogia(R) → Detect(R) → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → AssessFit(M, Sₐ, Sₜ) → I(M, F, Sₜ) → V → D_f → R' → (loop until terminalized)

── MORPHISM ──
R
  → detect(R, context)                 -- infer mapping uncertainty
  → decompose(abstract, concrete)      -- identify source and target domains
  → construct(mapping, Sₐ→Sₜ)          -- build structural correspondences
  → assess_fit(mapping, Sₐ, Sₜ, context) -- sort correspondence adequacy before user validation
  → instantiate(mapping, fit_map, target) -- generate concrete examples scoped by fit map
  → validate(instantiation, user)      -- user verifies mapping adequacy
  → declare_fit_disposition(fit_map, validation) -- record bounded residual status without a new gate
  → terminalize(mapping, user, fit_disposition) -- make mapping status explicit in output
  → ValidatedMapping
requires: uncertain(mapping(Sₐ, Sₜ))    -- runtime checkpoint (Phase 0)
deficit:  MappingUncertain               -- activation precondition (Layer 1/2)
preserves: content_identity(R)           -- output content invariant; mapping status recorded in R'
invariant: Structural Correspondence over Abstract Assertion

── TYPES ──
R        = Text containing abstract structures (source-agnostic: AI output, user analysis, or external reference)
             -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
Detect   = Mapping uncertainty detection: R → Bool
Sₐ       = Source domain (abstract structure in R)
Sₜ       = Target domain (user's concrete application context)
Map      = Structure-preserving mapping construction: (Sₐ, Sₜ) → Set(Correspondence)
M        = Set(Correspondence)                                   -- mapping result
Correspondence = { abstract: Component, concrete: Component, relation: String }
Component = { name: String, structure: String }
Context  = Observable mapping context from R, session context, and cited domain evidence
AssessFit = Correspondence adequacy assessment: M × Sₐ × Sₜ × Context → F
F        = CorrespondenceFitMap { preserved, partial, missing, overextended, open }
preserved = Set(Correspondence) where target structure preserves source relation
partial  = Set(Correspondence) where correspondence exists but some structural dimensions lack evidence
missing  = Set(Component) from Sₐ with no evidenced Sₜ correspondent
overextended = Set(Correspondence) where source relation adds unsupported target constraints
open     = Set(StructuralQuestion) where answer could change validation of M
StructuralQuestion = { structure: Component, reason: String, evidence_needed: String }
FitLabel ∈ {Preserved, Partial, Overextended}
fit_classification(F, c) =
  Preserved if c ∈ F.preserved
  Partial if c ∈ F.partial
  Overextended if c ∈ F.overextended
fit_partition(F, M) = F.preserved ∪ F.partial ∪ F.overextended = M (pairwise disjoint)
ResidualFitIssue ∈ Missing(Component) ∪ OpenQuestion(StructuralQuestion)
residual_issues(F) = { Missing(x) | x ∈ F.missing } ∪ { OpenQuestion(q) | q ∈ F.open }
FitDisposition = { issues: Set(ResidualFitIssue), status: None ∪ Bounded, declaration: String }
D_f      = FitDisposition
fit_disposition_declared(F, D_f) =
  (residual_issues(F) = ∅ ∧ D_f.status = None)
  ∨ (D_f.status = Bounded ∧ D_f.issues = residual_issues(F))
I        = Concrete instantiation: M × F × Sₜ → Example
Example  = { scenario: String, mapping_trace: List<Correspondence>, fit_basis: F }
V        = User validation ∈ {Confirm, Adjust(feedback), Dismiss}
ValidationRecord = { example: Example, answer: V, fit_label: FitLabel, residual_disposition: FitDisposition }
R'       = Updated output with explicit mapping status
ValidatedMapping = R' where terminalized(R', F, D_f)
terminalized(R', F, D_f) = (all_addressed(R') ∧ fit_disposition_declared(F, D_f)) ∨ user_esc
all_addressed(R') = ∀ c ∈ M : confirmed(c) ∨ dismissed(c)

── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output

/ground "text"                → R = "text"
/ground (alone)               → R = most recent relevant output in current session (AI or user)
"ground this..."              → R = text currently under discussion

If no relevant text exists: pause activation and request a grounding target before Phase 0.

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain?                             -- mapping uncertainty checkpoint (silent)
Phase 1: uncertain → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → M → AssessFit(M, Sₐ, Sₜ) → F  -- domain decomposition + fit map [Tool]
Phase 2: (M, F) → I(M, F, Sₜ) → Qs(I, F, framing) → Stop → V  -- instantiation + validation [Tool]
Phase 3: V → integrate(V, R, F) → (D_f, R')                     -- fit disposition + output update (sense)

── LOOP ──
After Phase 3: evaluate validation result.
If V = Confirm: mark correspondence confirmed; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
If V = Adjust(feedback): refine mapping with feedback → return to Phase 1.
If V = Dismiss: accept this correspondence as unresolved for this session; record fit label snapshot and D_f; terminalize if all correspondences addressed and fit disposition is declared.
Max 3 mapping attempts per domain pair.
Continue until: terminalized(R', F, D_f) OR attempts exhausted.
Convergence evidence: At terminalized(R', F, D_f), present transformation trace — for each record in Λ.validations, show (MappingUncertain(record.example.mapping_trace) → record.fit_label → record.answer). When D_f.status = Bounded, append the bounded residual mapping uncertainty from D_f.declaration and briefly invite the user to supply a missing Sₜ correspondent if one can be identified — a free response within the existing turn, not a new gate or post-convergence morphism. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
terminalized(R', F, D_f) = (all_addressed(R') ∧ fit_disposition_declared(F, D_f)) ∨ user_esc
progress(Λ) = 1 - |remaining| / |mappings|
narrowing(V, M) = |remaining(after)| < |remaining(before)|
early_exit = user_declares_mapping_sufficient

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect  (sense)     → Internal analysis (no external tool)
Phase 1 Map/AssessFit (observe) → Read, Grep (stored knowledge extraction: domain structure and fit analysis); WebSearch (conditional: external domain knowledge)
Phase 2 Qs      (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Validation)
Phase 3         (track)     → Internal state update
converge     (extension)       → TextPresent+Proceed (convergence evidence trace; proceed with validated mapping)

── MODE STATE ──
Λ = { phase: Phase, R: Text, Sₐ: Domain, Sₜ: Domain,
      mappings: Set(Correspondence), confirmed: Set(Correspondence),
      dismissed: Set(Correspondence), remaining: Set(Correspondence),
      fit_map: F, fit_disposition: D_f, instantiations: List<Example>,
      validations: List<ValidationRecord>, attempts: Nat, active: Bool,
      cause_tag: String }
-- Invariant: mappings = confirmed ∪ dismissed ∪ remaining (pairwise disjoint)
-- Invariant: fit_partition(F, M)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Structural Correspondence over Abstract Assertion**: When text contains abstract frameworks applied to a user's domain, validate that structure-preserving mappings exist between the abstract and concrete domains through explicit correspondences and concrete instantiations, rather than asserting that the abstraction applies. The purpose is to verify mapping adequacy, not to simplify the abstraction.

## Mode Activation

### Activation

AI detects mapping uncertainty in output OR user calls `/ground`. Detection is silent (Phase 0); validation always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2). On direct `/ground`, bind `R` from the current or most recent output under discussion; if no recoverable `R` exists, request the grounding target before Phase 0.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/ground` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Mapping uncertainty detected via in-protocol heuristics. Detection is silent (Phase 0).

**Mapping uncertain** = text applies abstract structures to a domain where structural correspondence has not been established.

Gate predicate:
```
uncertain(mapping(Sₐ, Sₜ)) ≡ ∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))
```

### Priority

<system-reminder>
When Analogia is active:

**Supersedes**: Direct output patterns that assume mapping validity
(Structural correspondence must be validated before proceeding)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present concrete instantiation for user validation of mapping adequacy via Cognitive Partnership Move (Constitution).
</system-reminder>

- Analogia completes before output dependent on mapping validity proceeds
- Loaded instructions resume after mapping status is made explicit

### Trigger Signals

Heuristic signals for mapping uncertainty detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Abstract framework applied | AI output uses a pattern, model, or analogy without domain-specific validation |
| Cross-domain transfer | Concept from one domain applied to a structurally different domain |
| Grounding probe | User requests "concrete example", "how does this apply to my case", "show me in my context" |
| Structural mismatch indicators | Abstract assumptions that may not hold in the concrete domain |

**Cross-session enrichment**: Accumulated mapping validation history from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) provides starting points for Phase 1 domain decomposition — previously validated correspondences may guide initial structural analysis. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior domain mappings the user has worked with, providing structural correspondence candidates that Phase 1 can evaluate against the current abstract–concrete pair. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Skip**:
- Output is already domain-specific with concrete instantiations
- User explicitly says "I understand the mapping" or "this applies"
- Same domain pair was validated in current session (session immunity)
- Phase 1 domain analysis confirms structural correspondence is trivial
- No abstract framework is applied (output is purely concrete)
- Colimit-shaped input detected (`essence_sensed` over concrete instances + `locator_absent(A)`) — route to `/induce` (Periagoge) for abstraction formation; Analogia's substitution interface fits mapping validation. `locator_absent(A)` is the shared cross-protocol predicate (Periagoge formal `¬located(A)`) — from Analogia's substitution-interface vantage it surfaces as a missing source abstraction Sₐ to substitute from
- Framework selection is the primary deficit (no analytical framework chosen for the inquiry) — route to `/frame` (Prothesis); Analogia validates the mapping of an *existing* framework, Prothesis selects frameworks when none is yet chosen
- Context insufficiency is the primary deficit (factual gaps in execution context — missing facts, missing user environment) — route to `/inquire` (Aitesis); Analogia checks *relational* correspondence between domains, Aitesis checks *factual* sufficiency for execution

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All correspondences addressed (confirmed or dismissed) | Proceed with validated mapping |
| User Esc key | Accept current output without further grounding |
| Attempt cap reached | Surface remaining uncertainty, accept current output with explicit unresolved mapping note |

## Protocol

### Phase 0: Mapping Uncertainty Checkpoint (Silent)

Analyze text for mapping uncertainty. This phase is **silent** — no user interaction.

1. **Bind output** `R`: use explicit argument or the current/most recent output under discussion
2. **Scan output** `R` for abstract structures: patterns, models, analogies, frameworks applied to user's domain
3. **Colimit-shape detection**: assess whether `R` is a colimit-shaped input — `essence_sensed` over concrete instances plus `locator_absent(A)` (Periagoge formal `¬located(A)`; from Analogia's substitution-interface vantage this surfaces as no source abstraction Sₐ available). Instance accumulation contributes evidence strength for the essence signal. When both criteria hold, route to `/induce` (Periagoge) for abstraction formation; Analogia remains scoped to mapping validation from a source abstraction to a concrete target.
4. **Check correspondence**: For each abstract structure, assess whether mapping to user's concrete domain is established
5. If all mappings trivially established: present finding per Rule 15 before proceeding (Analogia not activated)
6. If uncertain mappings identified: record `(Sₐ, Sₜ)` — proceed to Phase 1

**Scan scope**: Bound text R, conversation context, observable domain signals. Does NOT modify files or call external services.

### Phase 1: Domain Decomposition + Mapping Construction

Decompose abstract and concrete domains, then construct structural correspondences.

1. **Identify source domain** `Sₐ`: Extract abstract structures from R — components, relationships, constraints, assumptions
2. **Identify target domain** `Sₜ`: Determine user's concrete application context — environment, constraints, existing structures
   - **Call Read/Grep** to collect evidence about target domain from codebase, configs, documentation
3. **Construct mapping** `M`: For each abstract component, identify the candidate concrete correspondent
   - If correspondence is clear: add to confirmed candidates
   - If structural mismatch detected: flag as uncertain — include evidence
   - If no correspondent exists: flag as gap — the abstract structure may not apply
4. **Assess fit** `F`: Sort the correspondence adequacy into preserved, partial, missing, overextended, and open
   - `preserved`, `partial`, and `overextended` partition the constructed correspondences `M`
   - `missing` tracks source components that do not yet have evidenced target correspondents
   - `open` is limited to structural questions whose answer could change validation of the mapping
   - Do not include general analogy ideas, background caveats, or future exploration horizons
5. Proceed to Phase 2 with mapping candidates and fit map

**Web context** (conditional): When source or target domain knowledge exists primarily outside the codebase (external APIs, academic domains, industry standards), extend context collection to web search.
Web evidence is tagged with `source: "web:{url}"` for traceability.

**Scope restriction**: Read-only investigation only (Read, Grep, WebSearch). No test execution or file modifications.

### Phase 2: Instantiation + Validation

**Present** concrete instantiations for user validation via Cognitive Partnership Move (Constitution).

**Selection criterion**: Choose the correspondence whose validation would maximally narrow the remaining mapping uncertainty using `F`. Prioritize partial, overextended, missing-adjacent, or open-adjacent correspondences before already-preserved ones. When priority is equal, prefer the correspondence with richer structural evidence.

**Surfacing format**:

Present the mapping details as text output:
- **Abstract**: [component from Sₐ with structural description]
- **Concrete**: [proposed correspondence in Sₜ with evidence]
- **Fit**: [preserved / partial / missing / overextended / open issue, in plain language]
- **Example**: [concrete scenario demonstrating the mapping]
- [If structural mismatch detected: flag and explain]
- [If open issue could change validation: name the missing evidence or user-known fact]

Then **present**:

```
Does [abstract concept] map correctly to your context?

Options:
1. **Confirm** — [what this validated mapping enables for downstream work]
2. **Adjust** — [what aspect of the mapping diverges and how refinement would change the correspondence]
3. **Dismiss** — [what assumption about contextual fit is accepted without grounding]
```

Other is always available — user can propose an alternative mapping or describe a structural correspondence not captured by the presented options.

**Design principles**:
- **Structural evidence**: Show what abstract structures are being mapped and why
- **Fit map before choice**: Show only the correspondence-fit distinctions that matter for the current validation
- **Concrete instantiation**: Always include at least one concrete example in user's domain
- **Current correspondence framed**: Surface the correspondence currently being validated as framing — which mapping is in play this cycle — rather than a completion count across all correspondences
- **Actionable options**: Each option leads to a concrete next step

### Phase 3: Integration

After user response:

1. **Confirm**: Mark correspondence as validated, record the current fit classification with the validation, declare `D_f`, and update output `R'` to include explicit mapping status
2. **Adjust(feedback)**: Incorporate feedback, reconstruct mapping — return to Phase 1
3. **Dismiss**: Mark correspondence as not requiring further grounding in this session, record the current fit classification with the dismissal, declare `D_f`, and keep current output

`D_f` is declared during Phase 3 from the Phase 2 surface: `None` when `residual_issues(F)` is empty, otherwise `Bounded` with the missing/open issues that were visible before the gate. This is trace metadata, not a separate user gate.

After integration:
- Check remaining unvalidated correspondences
- If correspondences remain: return to Phase 2 (present next correspondence)
- If all correspondences are addressed and `D_f` is declared: proceed with updated output
- Log `ValidationRecord` to validations so convergence traces use the fit label that was active when the user judged the correspondence

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single obvious correspondence | Brief example + Constitution interaction with Confirm default |
| Medium | Multiple correspondences, partial structural match | Mapping table + concrete examples |
| Heavy | Complex cross-domain mapping, structural mismatches detected | Full domain decomposition + multiple instantiations + gap analysis |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Analogia) only if ∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))` | Prevents false activation on domain-specific output |
| Domain decomposition first | Phase 1 before Phase 2 | Ensures mapping is structurally grounded |
| One correspondence per cycle | Present highest-priority correspondence per Phase 2 | Prevents example overload |
| Session immunity | Validated domain pair → skip for session | Respects user's validation |
| Current-correspondence framing | Phase 2 surfaces the correspondence currently being validated (which mapping is in play this cycle) — a framing readout, not an `[N validated / M]` completion count | User recognizes which mapping is in play without parsing a coverage tally; granular progress stays in session |
| Attempt cap | Max 3 mapping attempts per domain pair | Prevents infinite refinement |
| Early exit | User can declare mapping sufficient at any Phase 2 | Full control over validation depth |

## Rules

1. **AI-guided, user-validated**: AI detects mapping uncertainty; validation requires user choice via Cognitive Partnership Move (Constitution) (Phase 2)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Domain decomposition first**: Before presenting instantiations, decompose abstract and concrete domain structures through codebase analysis (Phase 1)
4. **Structural Correspondence over Abstract Assertion**: When mapping is uncertain, construct explicit correspondences rather than assert mapping validity — silence is worse than a rejected mapping
5. **Concrete instantiation required**: Every mapping presented must include at least one concrete example in the user's domain
6. **Evidence-grounded**: Every correspondence must cite specific structural elements from both abstract and concrete domains
7. **Validation respected**: User validation or dismissal is final for that correspondence in the current session
8. **Convergence persistence**: Mode active until all identified correspondences are addressed or user Esc key
9. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
10. **Convergence evidence**: Present transformation trace before declaring terminalized(R', F, D_f); per-correspondence evidence is required
11. **Zero-gap surfacing**: If Phase 1 structural analysis finds perfect correspondence with no mapping gaps, present this finding with reasoning for user confirmation
12. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
13. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
14. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
15. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
16. **Protocol-native pressure map**: Phase 1 produces a CorrespondenceFitMap before validation. The map is a pre-gate support object for correspondence adequacy, not a terminal status and not generic calibration. `open` may surface bounded discovery pressure only when the missing evidence could change the user's validation of the current mapping. Missing/open residuals are declared through Phase 3 fit disposition metadata without adding a user gate.
