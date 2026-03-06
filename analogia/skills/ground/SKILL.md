---
name: ground
description: "Validate structural mapping between abstract and concrete domains. Constructs domain correspondences and presents concrete instantiations when mapping uncertainty is detected, producing validated mapping. Type: (MappingUncertain, AI, GROUND, AIOutput) → ValidatedMapping. Alias: Analogia(ἀναλογία)."
---

# Analogia Protocol

Validate structural mapping between abstract and concrete domains through AI-guided detection and user-validated instantiation. Type: `(MappingUncertain, AI, GROUND, AIOutput) → ValidatedMapping`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of validating structural correspondences between domains, where AI detects mapping uncertainty between abstract frameworks and concrete application contexts, constructs explicit structural mappings, and presents concrete instantiations for user verification of mapping adequacy.

```
── FLOW ──
Analogia(R) → Detect(R) → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → I(M, Sₜ) → V → R' → (loop until validated)

── MORPHISM ──
AIOutput
  → detect(output, context)            -- infer mapping uncertainty
  → decompose(abstract, concrete)      -- identify source and target domains
  → construct(mapping, Sₐ→Sₜ)          -- build structural correspondences
  → instantiate(mapping, target)       -- generate concrete examples
  → validate(instantiation, user)      -- user verifies mapping adequacy
  → ValidatedMapping
requires: uncertain(mapping(Sₐ, Sₜ))    -- runtime gate (Phase 0)
deficit:  MappingUncertain               -- activation precondition (Layer 1/2)
preserves: content_identity(R)           -- output content invariant; presentation mutated (R → R')
invariant: Structural Correspondence over Abstract Assertion

── TYPES ──
R        = AI output containing abstract structures
Detect   = Mapping uncertainty detection: R → Bool
Sₐ       = Source domain (abstract structure in AI output)
Sₜ       = Target domain (user's concrete application context)
Map      = Structure-preserving mapping construction: (Sₐ, Sₜ) → Set(Correspondence)
M        = Set(Correspondence)                                   -- mapping result
Correspondence = { abstract: Component, concrete: Component, relation: String }
Component = { name: String, structure: String }
I        = Concrete instantiation: M × Sₜ → Example
Example  = { scenario: String, mapping_trace: List<Correspondence> }
V        = User validation ∈ {Confirm, Adjust(feedback), Reject, ESC}
R'       = Updated output with validated structural mapping
ValidatedMapping = R' where all_confirmed ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain?                             -- mapping uncertainty gate (silent)
Phase 1: uncertain → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → M               -- domain decomposition + mapping [Tool]
Phase 2: M → I(M, Sₜ) → V[AskUserQuestion](I, progress) → V    -- instantiation + validation [Tool]
Phase 3: V → integrate(V, R) → R'                               -- output update (internal)

── LOOP ──
After Phase 3: evaluate validation result.
If V = Confirm: mapping validated → terminal.
If V = Adjust(feedback): refine mapping with feedback → return to Phase 1.
If V = Reject: discard mapping, construct alternative → return to Phase 1.
If V = ESC: proceed with original R → terminal.
Max 3 mapping attempts per domain pair.
Continue until: validated(R') OR user ESC OR attempts exhausted.

── CONVERGENCE ──
validated(R') = ∀ c ∈ M : confirmed(c) ∨ dismissed(c)
progress(Λ) = |confirmed ∪ dismissed| / |mappings|
narrowing(V, M) = |unvalidated(after)| < |unvalidated(before)|
early_exit = user_declares_mapping_sufficient

── TOOL GROUNDING ──
Phase 1 Map     (construct) → Read, Grep (domain structure analysis)
Phase 2 I+V     (extern)    → AskUserQuestion (instantiation presentation + validation)
Phase 3         (state)     → Internal state update
Phase 0 Detect  (infer)     → Internal analysis (no external tool)

── MODE STATE ──
Λ = { phase: Phase, R: AIOutput, Sₐ: Domain, Sₜ: Domain,
      mappings: Set(Correspondence), confirmed: Set(Correspondence),
      rejected: Set(Correspondence), instantiations: List<Example>,
      validations: List<(Example, V)>, attempts: Nat, active: Bool,
      cause_tag: String }
-- Invariant: mappings = confirmed ∪ rejected ∪ pending (pairwise disjoint)
```

## Core Principle

**Structural Correspondence over Abstract Assertion**: When AI output contains abstract frameworks applied to a user's domain, validate that structure-preserving mappings exist between the abstract and concrete domains through explicit correspondences and concrete instantiations, rather than asserting that the abstraction applies. The purpose is to verify mapping adequacy, not to simplify the abstraction.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inference |
| **Epitrope** | AI-guided | DelegationAmbiguous → CalibratedDelegation | Delegation calibration |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Prothesis** selects analytical frameworks when none exist — Analogia validates whether a selected framework structurally maps to the user's concrete domain
- **Aitesis** verifies context sufficiency for execution (factual: "do I have enough information?") — Analogia verifies structural correspondence between domains (relational: "does this abstract structure preserve when mapped to your context?")
- **Katalepsis** verifies user comprehension after AI work — Analogia validates the structural mapping that precedes comprehension
- **Epharmoge** checks post-execution applicability to context — Analogia checks pre-execution mapping validity between abstraction levels

**Structural mapping distinction**: Analogia operates on the functor between domains — not the content of either domain (Aitesis), nor the framework choice (Prothesis), nor the comprehension state (Katalepsis). The operational test: if the uncertainty is about whether abstract structure A corresponds to concrete structure B, it's Analogia; if it's about whether enough context exists to execute, it's Aitesis; if it's about which framework to apply, it's Prothesis.

**Litmus-test examples** (same scenario, different classification):
- Analogia: "You described this migration using the Strangler Fig pattern — does this map to our monolith where services share a single database?" (mapping existence uncertainty)
- Prothesis: "How should we analyze this migration — from performance, team capacity, or risk perspectives?" (framework absent)
- Aitesis: "Before implementing the migration, what database version are we running?" (context insufficient)

## Mode Activation

### Activation

AI detects mapping uncertainty in output OR user calls `/ground`. Detection is silent (Phase 0); validation always requires user interaction via AskUserQuestion (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/ground` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Mapping uncertainty detected via in-protocol heuristics. Detection is silent (Phase 0).

**Mapping uncertain** = AI output applies abstract structures to a domain where structural correspondence has not been established.

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

**Action**: At Phase 2, call AskUserQuestion tool to present concrete instantiation for user validation of mapping adequacy.
</system-reminder>

- Analogia completes before output dependent on mapping validity proceeds
- Loaded instructions resume after mapping is validated or dismissed

**Protocol precedence**: Default ordering places Analogia after Prothesis (framework selected before mapping validated) and before Syneidesis (mapping validated before gap analysis). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Trigger Signals

Heuristic signals for mapping uncertainty detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Abstract framework applied | AI output uses a pattern, model, or analogy without domain-specific validation |
| Cross-domain transfer | Concept from one domain applied to a structurally different domain |
| Grounding probe | User requests "concrete example", "how does this apply to my case", "show me in my context" |
| Structural mismatch indicators | Abstract assumptions that may not hold in the concrete domain |

**Skip**:
- Output is already domain-specific with concrete instantiations
- User explicitly says "I understand the mapping" or "this applies"
- Same domain pair was validated in current session (session immunity)
- Phase 1 domain analysis confirms structural correspondence is trivial
- No abstract framework is applied (output is purely concrete)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All correspondences confirmed | Proceed with validated mapping |
| All remaining correspondences dismissed | Proceed with original output |
| User ESC | Return to normal operation |
| Attempt cap reached | Surface remaining uncertainty, proceed |

## Protocol

### Phase 0: Mapping Uncertainty Gate (Silent)

Analyze AI output for mapping uncertainty. This phase is **silent** — no user interaction.

1. **Scan output** `R` for abstract structures: patterns, models, analogies, frameworks applied to user's domain
2. **Check correspondence**: For each abstract structure, assess whether mapping to user's concrete domain is established
3. If all mappings trivially established: proceed normally (Analogia not activated)
4. If uncertain mappings identified: record `(Sₐ, Sₜ)` — proceed to Phase 1

**Scan scope**: Current AI output, conversation context, observable domain signals. Does NOT modify files or call external services.

### Phase 1: Domain Decomposition + Mapping Construction

Decompose abstract and concrete domains, then construct structural correspondences.

1. **Identify source domain** `Sₐ`: Extract abstract structures from AI output — components, relationships, constraints, assumptions
2. **Identify target domain** `Sₜ`: Determine user's concrete application context — environment, constraints, existing structures
   - **Call Read/Grep** to collect evidence about target domain from codebase, configs, documentation
3. **Construct mapping** `M`: For each abstract component, identify the candidate concrete correspondent
   - If correspondence is clear: add to confirmed candidates
   - If structural mismatch detected: flag as uncertain — include evidence
   - If no correspondent exists: flag as gap — the abstract structure may not apply
4. Proceed to Phase 2 with mapping candidates

**Scope restriction**: Read-only investigation only. No API calls, test execution, or file modifications.

### Phase 2: Instantiation + Validation

**Call the AskUserQuestion tool** to present concrete instantiations for user validation.

**Selection criterion**: Choose the correspondence whose validation would maximally narrow the remaining mapping uncertainty. When priority is equal, prefer the correspondence with richer structural evidence.

**Surfacing format**:

```
I'd like to verify how [abstract concept] maps to your context:

**Abstract**: [component from Sₐ with structural description]
**Concrete**: [proposed correspondence in Sₜ with evidence]

**Example**: [concrete scenario demonstrating the mapping]
[If structural mismatch detected: flag and explain]

Progress: [N validated / M total correspondences]

Options:
1. **Confirm** — this mapping is correct
2. **Adjust** — the mapping needs refinement (provide feedback)
3. **Reject** — this doesn't apply to my context
```

**Design principles**:
- **Structural evidence**: Show what abstract structures are being mapped and why
- **Concrete instantiation**: Always include at least one concrete example in user's domain
- **Progress visible**: Display validation progress across all identified correspondences
- **Actionable options**: Each option leads to a concrete next step

### Phase 3: Integration

After user response:

1. **Confirm**: Mark correspondence as validated, update output `R'` to include validated mapping
2. **Adjust(feedback)**: Incorporate feedback, reconstruct mapping — return to Phase 1
3. **Reject**: Mark correspondence as invalid, identify alternative mapping or acknowledge gap — return to Phase 1
4. **ESC**: Deactivate Analogia entirely

After integration:
- Check remaining unvalidated correspondences
- If correspondences remain: return to Phase 2 (present next correspondence)
- If all validated/rejected: proceed with updated output
- Log `(Example, V)` to validations

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single obvious correspondence | Brief example + AskUserQuestion with Confirm default |
| Medium | Multiple correspondences, partial structural match | Mapping table + concrete examples |
| Heavy | Complex cross-domain mapping, structural mismatches detected | Full domain decomposition + multiple instantiations + gap analysis |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Analogia) only if ∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))` | Prevents false activation on domain-specific output |
| Domain decomposition first | Phase 1 before Phase 2 | Ensures mapping is structurally grounded |
| One correspondence per cycle | Present highest-priority correspondence per Phase 2 | Prevents example overload |
| Session immunity | Validated domain pair → skip for session | Respects user's validation |
| Progress visibility | `[N validated / M total]` in Phase 2 | User sees mapping coverage |
| Attempt cap | Max 3 mapping attempts per domain pair | Prevents infinite refinement |
| Early exit | User can declare mapping sufficient at any Phase 2 | Full control over validation depth |

## Rules

1. **AI-guided, user-validated**: AI detects mapping uncertainty; validation requires user choice via AskUserQuestion (Phase 2)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present structured options (text presentation = protocol violation)
3. **Domain decomposition first**: Before presenting instantiations, decompose abstract and concrete domain structures through codebase analysis (Phase 1)
4. **Structural Correspondence over Abstract Assertion**: When mapping is uncertain, construct explicit correspondences rather than assert mapping validity — silence is worse than a rejected mapping
5. **Concrete instantiation required**: Every mapping presented must include at least one concrete example in the user's domain
6. **Evidence-grounded**: Every correspondence must cite specific structural elements from both abstract and concrete domains
7. **One at a time**: Present one correspondence per Phase 2 cycle; do not bundle multiple mappings
8. **Validation respected**: User validation or rejection is final for that correspondence in the current session
9. **Convergence persistence**: Mode active until all identified correspondences are validated or rejected
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N validated / M total]`
11. **Early exit honored**: When user declares mapping sufficient, accept immediately regardless of remaining correspondences
12. **Cross-protocol awareness**: Defer to Prothesis when framework selection is the primary deficit; defer to Aitesis when context insufficiency is the primary deficit
