# Failure-Mode Catalog

Contributor reference cataloging recurring framing and elicitation failure patterns drawn from HCI literature and language-model interaction practice. Entries in this catalog are background knowledge for contributors considering future runtime changes; they are not wired into any runtime protocol.

**Status**: Contributor reference document. Not a protocol. Outside Deficit Empiricism scope because entries introduce no new TYPES, protocols, or axioms — they surface patterns for contributor judgment only. Wiring a catalog entry into runtime behavior re-engages the usual empirical-grounding requirement.

**Scope**: Patterns that corrupt the epistemic inputs of a human-AI session before execution begins — mis-framings, elicitation gaps, silently narrowed option spaces. Post-execution failure modes (incorrect outputs, miscalibrated confidence in results) are out of scope.

**Entry schema**: Pattern name, Description, Evidence note, Mapping (which runtime surface the pattern corresponds to, if any; most entries are contributor reference only).

**Notation**:
- **A″** = Framing-Instability Observer (emits `⇌ framing — …` in `epistemic-cooperative/styles/epistemic-ink.md`)

---

## 1. XY-Problem

**Description**: The user asks about a specific technique or tactic (Y) they believe will solve their underlying goal (X), without surfacing X itself. The AI optimizes Y, the refinement compounds, and the session produces a polished Y that does not advance X — often because a different approach Z dominates once X is visible.

**Evidence note**: Long-standing pattern in developer-support communities; originating formulation attributed to the Perl community FAQ tradition and the `xyproblem.info` reference compilation. HCI literature: documented in help-seeking behavior studies as "solution presentation in place of problem statement."

**Mapping**: Informs the A″ `⇌ framing` observer — when cross-turn evidence shows the stated target (Y) mutating while no grounding discussion of X appears, the observer cites the turns where the user's constraints contradict the stated Y.

---

## 2. Solution-Fixation

**Description**: The user anchors to the first technically plausible approach surfaced in the session and treats subsequent discussion as implementation detail for that approach. Alternative framings are silently discarded — not rejected on merit, but never re-entered as live options. The fixation is visible when new constraints should reopen the design space but the conversation proceeds as if the anchor is settled.

**Evidence note**: Design-fixation is a well-established construct in engineering design research (Jansson & Smith, *Design Studies*, 1991). The HCI variant manifests strongly in mixed-initiative systems where the AI's first fluent response becomes the anchor. Claude-training guidance explicitly discourages anchoring on early proposals when downstream signals invalidate them.

**Mapping**: Informs the A″ `⇌ framing` observer — when the user introduces a new constraint that is inconsistent with the anchored approach yet the approach persists unchallenged, the observer surfaces the constraint/approach mismatch with cited turn references.

---

## 3. Articulation Bias

**Description**: The user expresses only the requirements they can articulate in the current vocabulary — constraints they hold tacitly but cannot (yet) name are omitted from the prompt. The AI produces output that satisfies the articulated subset and violates the unarticulated complement. The user experiences this as "technically correct but wrong in spirit" without being able to specify the missing rule.

**Evidence note**: Closely related to Polanyi's tacit knowledge (*The Tacit Dimension*, 1966) and studied in requirements engineering as implicit/tacit requirements elicitation. HCI literature: general observation that interactive systems surface tacit requirements through iteration and conflict, not through initial statement.

**Mapping**: Contributor reference. Tacit constraints commonly sit in regulatory, performance, and policy dimensions that users do not spontaneously enumerate.

---

## 4. Prompt-Literacy Gap

**Description**: The user's ability to express goals in language the AI can operationalize lags behind the goals themselves. The user holds a coherent intention but renders it in phrasing that is either under-specified (producing generic output) or miscoded (producing output aligned with the surface phrasing rather than the underlying intent). The gap is not a user deficiency — it reflects the asymmetry between natural language as lived and natural language as a specification medium for machine behavior.

**Evidence note**: Emerging area in HCI — e.g., Zamfirescu-Pereira et al. CHI 2023 ("Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts"). Claude-training guidance acknowledges that charitable interpretation of under-specified prompts is a core capability, but charitable interpretation can mask the gap rather than surface it.

**Mapping**: Contributor reference. Domain-specific vocabulary gaps — regulatory, performance, and stakeholder-perspective terms — are the loci where prompt-literacy gaps most often manifest; charitable interpretation may mask rather than surface these gaps.

---

## 5. Stakeholder-Omission

**Description**: The user frames the prospect from a single vantage point — typically their own role — and silently excludes parties whose constraints or interests shape the decision space. Downstream consumers, operators, auditors, and end users become invisible in the initial framing. The AI optimizes for the stated vantage and produces output that violates omitted-stakeholder constraints.

**Evidence note**: Stakeholder analysis is a foundational technique in requirements engineering and participatory design (e.g., Freeman's stakeholder theory, 1984; extended through HCI via value-sensitive design — Friedman et al.). HCI literature: general observation that single-role framings correlate with late-stage rework when omitted-stakeholder constraints surface.

**Mapping**: Contributor reference. Operators are the most-omitted stakeholder class in developer-initiated prompts; auditors and end users follow.

---

## 6. Happy-Path Framing

**Description**: The prospect is specified in terms of the successful, nominal execution path — what should happen when inputs are well-formed, dependencies are available, and preconditions hold. Behavior under partial failure, degraded dependencies, adversarial input, or boundary conditions is absent from the framing. The AI produces a solution optimized for the nominal path that fails silently or catastrophically at the edges.

**Evidence note**: Long-standing observation in software engineering practice; formalized in approaches such as defensive design and property-based testing. HCI literature: general observation that novice-to-intermediate users frame prospects around the nominal path more frequently than experts, and AI-produced code inherits this framing unless edge-case prompting is explicit.

**Mapping**: Contributor reference. The failure-and-edge-modes framing-omission is the natural locus for this pattern.

---

## 7. Scope-Creep

**Description**: The original scope contract is under-specified at prompt formation, leaving no explicit boundary against incremental additions. As the session proceeds, each increment appears locally minor and passes without renegotiation, but accumulated scope exceeds the implicit original target. The AI silently absorbs each increment, optimizing for the latest specification. Manifests as "I wanted to fix X, how did we end up rewriting Y?" The input-stage defect is the missing scope contract; the cross-turn drift is its symptom — visible cumulatively but invisible within any single turn.

**Evidence note**: Named as a distinct SE risk category in Capers Jones, *Assessment and Control of Software Risks* (Prentice Hall, 1994), which dedicates a chapter to creeping user requirements. DeMarco's *Controlling Software Projects* (1982) addresses requirements volatility earlier but does not name the pattern as a distinct failure mode. HCI literature: observed in long-running mixed-initiative sessions where each turn's incremental request appears locally justified while cumulative drift remains unsurfaced — this framing is derivative of the SE risk tradition.

**Mapping**: Informs the A″ `⇌ framing` observer — when the stated goal expands across turns without explicit renegotiation, the observer cites the turns where scope additions accumulated past the original target.
