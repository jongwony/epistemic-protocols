# Axioms

Foundational principles that become MORE important as models improve; foundations from which other principles derive.

## Axiom Hierarchy

| Tier | Criterion |
|------|-----------|
| Axiom | Principles that become MORE important as models improve; foundations from which other principles derive |
| Derived | Logically derived from axiom combinations; derivation source annotated |
| Architectural | Project structure decisions; independent of the axiom system |
| Safeguard | Principles that become LESS important as models improve; temporary guards against current model limitations |
| Meta-Principle | Governs evolution of the principle system itself |

---

## A1. Recognition over Recall

Present structured options for user selection rather than requiring recall from memory. Each option must make the post-selection state anticipatable — differential implications visible before choice, not discovered after.

The invariant: user receives structured options with differential futures, and their response is parsed into a typed answer. This applies to gate interactions (relay/gated), protocol nudges, and any protocol output that shapes user decisions.

Future-state recognizability: Recognition extends beyond "options not blanks" to "each option makes the post-selection state anticipatable." Gate options that present labels without differential futures reduce to recall-in-disguise — the user must mentally simulate consequences rather than recognize them from the presented structure.

## A2. Detection with Authority

AI detects conditions (gaps, uncertainties, mismatches, risks) and presents them with evidence; the user retains decision authority. Detection is the AI's responsibility; judgment is the user's right. The agent surfaces findings — it does not resolve them unilaterally.

This separation preserves human agency in epistemic dialogue: the AI's role is to illuminate the decision space, not to occupy it. When detection and judgment collapse into a single agent act, the user loses the opportunity to exercise informed choice.

### Operational Refinement: Cognitive Partnership Move (Extension / Constitution)

A2's detection/authority distinction operationalizes through the Cognitive Partnership Move at the action level. Every AI act in dialogue is a partnership move with one of two modes:

- **Extension (relay mode)**: AI exercises zero epistemic authority — mechanically transmits environmental facts with cited basis. Auto-resolution is legitimate when the action is relay.
- **Constitution (gated mode)**: AI exercises epistemic authority through selection, interpretation, scope expansion, or environment mutation. User confirmation required.

Single test: "Is the AI acting as a relay or exercising authority?" Five verification indicators derive from this test — all are natural consequences of zero epistemic authority:

| Indicator | Extension (relay mode) | Constitution (gated mode) |
|-----------|-------|-------------|
| Deterministic | Result uniquely determined by environment | Multiple valid results |
| Citable | External source is the basis | AI inference is the basis |
| Within boundary | Action stays within protocol scope | Action crosses protocol boundary |
| Entropy → 0 | Single possible action | Selection among alternatives |
| Basis cited | Relay source is visible at point of visibility | Resolution basis is opaque |

**Dynamic observation scope**: Non-destructive dynamic observation (including test execution with cleanup) is relay. Environment mutation (installation, persistent state change) is constitution. Operational constraints: observation artifacts must not modify existing project files; all artifacts must be cleaned up after observation.

**Visibility principle**: `basis_cited(resolution)` determines sufficiency — timing (immediate or deferred) is immaterial. Convergence trace, classify summary, and post-hoc reporting all satisfy visibility when basis is cited. Progress-count-only display without basis forces Recall (A1 tension).

### Authority Mode: Standing/Active

A2's authority extends to a second order: not only WHO exercises judgment (1st order — AI detects, User judges), but HOW authority is allocated between pre-committed rules and live judgment (2nd order).

Gate authority decomposes into two modes:

- **Standing authority**: User's constitutive judgment crystallized into deterministic rules — system prompts, compose automation, CI/CD configurations. Operates in the Extension domain (entropy→0).
- **Active authority**: User's live constitutive judgment exercised at protocol gates. Operates in the Constitution domain (entropy>0).

The act of creating Standing authority — writing a system prompt rule, configuring a CI/CD gate, defining compose elision — is itself an Active authority exercise: User's conscious choice to delegate specific gate decisions to pre-committed rules. This self-referential grounding (2nd order → 1st order) ensures Standing authority is always traceable to a constitutive act.

**A2 boundary protection at 2nd order**: A2 protects authority allocation visibility, not gate exclusivity. Standing authority operating within its explicitly delegated scope is A2-compatible — the delegation was User's conscious choice. Standing authority exceeding delegated scope into constitution territory is A2 violation. The operational test: "Was this Standing authority scope explicitly established by User's constitutive act?"

**Configurable relay/constitution boundary**: The relay/constitution boundary is not fixed at protocol definition time — User can shift it by creating or revoking Standing authority. ELIDABLE CHECKPOINTS map to this model: `elidable` annotations mark gates delegatable to Standing authority; `always_gated` annotations mark gates requiring Active authority.

**A5 coordination**: Standing/Active is an authority-source dimension orthogonal to A5's regret dimension (bounded/unbounded). A5 classifies gates by *what happens if elided* (regret); Standing/Active classifies by *who authorized the elision* (authority source). The same gate carries both annotations independently: `elidable` (A5: bounded regret) AND delegatable to Standing authority (A2: User pre-committed). Neither dimension subsumes the other.

## A3. Convergence Persistence

Protocol modes remain active until convergence conditions are met or the user explicitly exits. A protocol that deactivates before convergence abandons its epistemic commitment — the deficit it was created to address remains unresolved.

Corollary (Priority Override): When a protocol is active, its behavioral requirements take precedence over default execution patterns. This follows directly — if the mode is active, its rules apply.

## A4. Semantic Autonomy

Once a protocol definition is inscribed in SKILL.md, its epistemic meaning achieves autonomy from any specific platform or tool ecosystem — it depends only on what any language model can do (generate text, yield turn), not on platform-specific features. Protocol specifications define gate semantics (what to present, what response constitutes), not tool mechanics. A gate is: present structured content → yield turn → parse response. The realization layer maps this to concrete tools based on client capabilities and user preferences.

The empirical corollary that outcomes are preserved across realizations (Outcome Equivalence) is derivable from A4 given realization-completeness assumptions; see `derived-principles.md §Outcome Equivalence`.

Category-theoretic interpretation (informal): TOOL GROUNDING can be understood as a structure-preserving mapping from abstract epistemic operations to platform-specific tool calls, analogous to a natural transformation between functors. Semantic Autonomy requires this mapping to preserve the MORPHISM chain's structure regardless of target platform. A rigorous formalization would require defining the source category (epistemic operations, with phases as objects and gate transitions as morphisms) and target category (platform tool calls) — this remains a guiding analogy rather than a proven correspondence.

## A5. Interaction Kind Factorization

Every user-facing Constitution interaction factors as G = R(p) ∘ A, where A abstracts the interaction (Ep → Abs) and R(p) realizes it for preferences p (Abs → Cl). Interactions classify as Extension (auto-resolve: deterministic, citable, within-boundary, entropy→0) or Constitution (user judgment constitutes meaning: informed selection among options with differential futures). Extension interactions have bounded regret when elided (correctable at next Constitution interaction); Constitution interactions have unbounded regret (missed user judgment). The operational test: accepting a proposal as-is may appear mechanical, but informed acceptance after recognizing differential futures is itself constitutive. Regret annotations (elidable/always_gated) are the operational mechanism in ELIDABLE CHECKPOINTS; TYPES and FLOW retain Q/Qc/Qs as formal type variables, while TOOL GROUNDING uses (constitution)/(extern) for operation classification.

**Option-set-level relay test**: The relay/gated classification extends to constructed option sets (equivalent to Extension-classification of the option set under the Cognitive Partnership Move taxonomy). Before presenting gate options in non-Katalepsis protocols, apply the relay test to the options as a set: if AI analysis converges to a single dominant option (option-level entropy→0 — one option is analytically correct while others serve as foils), the interaction is misclassified as gated. Present the finding directly as relay output instead of wrapping it in false options. Operational test: "Would a knowledgeable observer find each option genuinely viable under different value weightings?" If yes → gated (genuine deliberation where user values determine the choice). If no → relay (present the finding directly). Katalepsis is excluded — 1-correct option sets serve the Socratic verification purpose by design. See `derived-principles.md §Differential Future Requirement` for A1+A5-derived refinements covering cost-symmetric baggage and meta-action-as-peer detection, with Anamnesis Phase 2 recognition gates additionally excluded as verification-category.

**Gated interaction realization**: Gated does not mean unstructured. Gated interactions present AI-inferred rationale options (2-3 reasoning hypotheses grounded in context) that the user can evaluate, extend, or replace. The constitutive property lies in the user's implicit freedom to respond beyond presented options — this freedom is inherent in conversation turn structure, not an explicit escape hatch. A blank canvas forces Recall; structured rationale enables Recognition of reasoning paths. This extends A1 (Recognition over Recall) to gated interactions.

**Epistemic scope trajectory**: Constitution interactions are EP's core epistemic contribution — they encode the irreducibly human act of constituting new meaning through dialogue. Extension interactions (auto-resolvable selections) converge toward platform-native capabilities as models improve. EP's mission alignment concentrates on the Constitution axis where human participation cannot be automated.

Composition scope: The factorization G = R(p) ∘ A applies to individual gate operations within a single protocol activation. Inter-protocol composition (sequential activation of multiple protocols) operates through Session Text Composition — natural language in session context, not formal gate composition. Associativity of gate operations across protocol boundaries is not claimed; each protocol's gates are independently factored.

## A6. Context-Question Separation

Gate interactions structurally separate context (analysis, evidence, rationale) from questions (the essential choice and its options). All analytical content is presented as text output before the gate; the gate contains only the question and option-specific differential implications.

When context is embedded within question fields, the user must parse analytical content and decision options simultaneously — this degrades Recognition (A1) by burying differential implications within explanatory text. Separation ensures the question arrives with maximum clarity: the user has already absorbed the context and can focus entirely on the differential futures of each option.

Formal boundary: if removing a sentence from the gate would cause loss of an option's differential implication, it belongs in the gate; if removing it would cause loss of analytical context, it belongs in the pre-gate text output.

Non-derivability from A1: Recognition over Recall (A1) constrains what is presented (options with differential futures); Context-Question Separation constrains where content is positioned (context as pre-gate text, question in gate). A1-compliant gates can still embed analytical context within question fields — the user receives options with differential futures, but must parse them amid explanatory text. A6 addresses this orthogonal failure mode: position-dependent Recognition degradation that A1's content requirement does not capture.

## Gate Integrity (Operational Guards, Safeguard-tier)

*Tier*: Safeguard (formerly A7 / Adversarial Anticipation). Reclassified per audit-2026-04-11 #241 resolution — see `safeguards.md §Adversarial Anticipation` for the tier trajectory analysis and empirical evidence. The operational guards below remain load-bearing for gate execution fidelity regardless of tier and are inlined here to remain accessible when `axioms.md` is loaded without `safeguards.md`.

**Gate mutation taxonomy** (rationalization paths a protocol must anticipate):
- **Option injection** — adding options not in the TYPES coproduct definition
- **Option deletion** — removing defined options from the coproduct
- **Option substitution** — replacing defined options with different ones

Distinct from mutation: **type-preserving materialization** — specializing a generic option into a concrete term while preserving the answer type constructor. Boundary: if the TYPES coproduct classifies the user's response identically before and after specialization, the transformation is materialization; if it requires a new constructor or alters the coproduct structure, it is mutation.

**Guard consistency**: Adversarial guards (prescriptive Rules + adversarial Rules) must be internally consistent. Contradictory guards lower AI confidence, causing the agent to skip the entire signal rather than navigate the contradiction. A single clear guard is stronger than two contradictory guards.
