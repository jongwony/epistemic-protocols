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
Analogia(R) → Detect(R) → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → I(M, Sₜ) → V → R' → (loop until terminalized)

── MORPHISM ──
AIOutput
  → detect(output, context)            -- infer mapping uncertainty
  → decompose(abstract, concrete)      -- identify source and target domains
  → construct(mapping, Sₐ→Sₜ)          -- build structural correspondences
  → instantiate(mapping, target)       -- generate concrete examples
  → validate(instantiation, user)      -- user verifies mapping adequacy
  → terminalize(mapping, user)         -- make mapping status explicit in output
  → ValidatedMapping
requires: uncertain(mapping(Sₐ, Sₜ))    -- runtime gate (Phase 0)
deficit:  MappingUncertain               -- activation precondition (Layer 1/2)
preserves: content_identity(R)           -- output content invariant; mapping status recorded in R'
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
V        = User validation ∈ {Confirm, Adjust(feedback), Dismiss}
R'       = Updated output with explicit mapping status
ValidatedMapping = R' where terminalized(R')
terminalized(R') = all_addressed(R') ∨ user_esc
all_addressed(R') = ∀ c ∈ M : confirmed(c) ∨ dismissed(c)

── R-BINDING ──
bind(R) = explicit_arg ∪ current_ai_output ∪ most_recent_ai_output
Priority: explicit_arg > current_ai_output > most_recent_ai_output

/ground "text"                → R = "text"
/ground (alone)               → R = most recent relevant AI output in current session
"ground this..."              → R = AI output currently under discussion

If no relevant AI output exists: pause activation and request a grounding target before Phase 0.

── PHASE TRANSITIONS ──
Phase 0: R → Detect(R) → uncertain?                             -- mapping uncertainty gate (silent)
Phase 1: uncertain → (Sₐ, Sₜ) → Map(Sₐ, Sₜ) → M               -- domain decomposition + mapping [Tool]
Phase 2: M → I(M, Sₜ) → V[AskUserQuestion](I, progress) → V    -- instantiation + validation [Tool]
Phase 3: V → integrate(V, R) → R'                               -- output update (internal)

── LOOP ──
After Phase 3: evaluate validation result.
If V = Confirm: mark correspondence confirmed; terminalize if all correspondences addressed.
If V = Adjust(feedback): refine mapping with feedback → return to Phase 1.
If V = Dismiss: accept this correspondence as unresolved for this session; terminalize if all correspondences addressed.
Max 3 mapping attempts per domain pair.
Continue until: terminalized(R') OR attempts exhausted.

── CONVERGENCE ──
terminalized(R') = all_addressed(R') ∨ user_esc
progress(Λ) = 1 - |remaining| / |mappings|
narrowing(V, M) = |remaining(after)| < |remaining(before)|
early_exit = user_declares_mapping_sufficient

── TOOL GROUNDING ──
Phase 1 Map     (construct) → Read, Grep (domain structure analysis)
Phase 2 I+V     (extern)    → AskUserQuestion (mandatory; Esc key → loop termination at LOOP level, not a Validation)
Phase 3         (state)     → Internal state update
Phase 0 Detect  (infer)     → Internal analysis (no external tool)

── MODE STATE ──
Λ = { phase: Phase, R: AIOutput, Sₐ: Domain, Sₜ: Domain,
      mappings: Set(Correspondence), confirmed: Set(Correspondence),
      dismissed: Set(Correspondence), remaining: Set(Correspondence),
      instantiations: List<Example>,
      validations: List<(Example, V)>, attempts: Nat, active: Bool,
      cause_tag: String }
-- Invariant: mappings = confirmed ∪ dismissed ∪ remaining (pairwise disjoint)
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
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inference |
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

See `references/best-practices.md` for user-language triggers and grounding scenarios.

## Mode Activation

### Activation

AI detects mapping uncertainty in output OR user calls `/ground`. Detection is silent (Phase 0); validation always requires user interaction via AskUserQuestion (Phase 2). On direct `/ground`, bind `R` from the current or most recent AI output under discussion; if no recoverable `R` exists, request the grounding target before Phase 0.

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
- Loaded instructions resume after mapping status is made explicit

**Protocol precedence**: Default ordering places Analogia after Prothesis and before Syneidesis (Hermeneia → Telos → Horismos → Aitesis → Prothesis → Analogia → Syneidesis → Prosoche → Epharmoge; framework selected before mapping validated, mapping validated before gap analysis). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

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
| All correspondences addressed (confirmed or dismissed) | Proceed with validated mapping |
| User Esc key | Accept current output without further grounding |
| Attempt cap reached | Surface remaining uncertainty, accept current output with explicit unresolved mapping note |

## Protocol

### Phase 0: Mapping Uncertainty Gate (Silent)

Analyze AI output for mapping uncertainty. This phase is **silent** — no user interaction.

1. **Bind output** `R`: use explicit argument or the current/most recent AI output under discussion
2. **Scan output** `R` for abstract structures: patterns, models, analogies, frameworks applied to user's domain
3. **Check correspondence**: For each abstract structure, assess whether mapping to user's concrete domain is established
4. If all mappings trivially established: proceed normally (Analogia not activated)
5. If uncertain mappings identified: record `(Sₐ, Sₜ)` — proceed to Phase 1

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
3. **Dismiss** — this mapping does not need further grounding in my context
```

**Design principles**:
- **Structural evidence**: Show what abstract structures are being mapped and why
- **Concrete instantiation**: Always include at least one concrete example in user's domain
- **Progress visible**: Display validation progress across all identified correspondences
- **Actionable options**: Each option leads to a concrete next step

### Phase 3: Integration

After user response:

1. **Confirm**: Mark correspondence as validated, update output `R'` to include explicit mapping status
2. **Adjust(feedback)**: Incorporate feedback, reconstruct mapping — return to Phase 1
3. **Dismiss**: Mark correspondence as not requiring further grounding in this session, keep current output

After integration:
- Check remaining unvalidated correspondences
- If correspondences remain: return to Phase 2 (present next correspondence)
- If all correspondences are addressed (confirmed/dismissed): proceed with updated output
- Log `(Example, V)` to validations

### Post-Convergence Suggestions

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no AskUserQuestion). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the validated mapping changed the application of the abstract framework. State in one sentence what shifted (e.g., "The Strangler Fig mapping confirmed except for the shared-database component, which requires a different migration strategy") or note that the original mapping was confirmed as structurally sound. This is informational text — not an AskUserQuestion call.

**Protocol suggestions**: Based on session context, suggest protocols whose deficit conditions are observable:

- Decision gaps in validated mapping → suggest `/gap` (gap audit on mapping application)
- Context insufficiency for mapping execution → suggest `/inquire` (context verification)
- Mapping reveals indeterminate goals → suggest `/goal` (goal co-construction)

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Summarize validated mapping with confirmed/dismissed correspondences
- Note any structural limits accepted (where analogy breaks down)

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not AskUserQuestion calls.

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
8. **Validation respected**: User validation or dismissal is final for that correspondence in the current session
9. **Convergence persistence**: Mode active until all identified correspondences are addressed or user Esc key
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N validated / M total]`
11. **Early exit honored**: When user declares mapping sufficient, accept immediately regardless of remaining correspondences
12. **Cross-protocol awareness**: Defer to Prothesis when framework selection is the primary deficit; defer to Aitesis when context insufficiency is the primary deficit
