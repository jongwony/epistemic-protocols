# Failure-Mode Catalog

External-knowledge reference cataloging recurring framing and elicitation failure patterns that the project's runtime observers (Output Style `↗ framing` nudge) and scanning heuristics (Aitesis Phase 0 commonly-missed context categories) are designed to surface.

**Status**: Reference document. Not a protocol. Not subject to Deficit Empiricism N≥3 barrier — entries draw from HCI literature and language-model interaction practice, surfacing patterns *before* within-project accumulation reaches that threshold.

**Scope**: Patterns that corrupt the epistemic inputs of a human-AI session before execution begins — mis-framings, elicitation gaps, silently narrowed option spaces. Post-execution failure modes (incorrect outputs, miscalibrated confidence in results) are out of scope.

**Entry schema**: Pattern name, Description, Evidence note, Mapping (which runtime observer or scan heuristic the entry informs).

---

## 1. XY-Problem

**Description**: The user asks about a specific technique or tactic (Y) they believe will solve their underlying goal (X), without surfacing X itself. The AI optimizes Y, the refinement compounds, and the session produces a polished Y that does not advance X — often because a different approach Z dominates once X is visible.

**Evidence note**: Long-standing pattern in developer-support communities; originating formulation attributed to the Perl community FAQ tradition and the `xyproblem.info` reference compilation. HCI literature: documented in help-seeking behavior studies as "solution presentation in place of problem statement."

**Mapping**: Informs the A″ `↗ framing` nudge — when cross-turn evidence shows the stated target (Y) mutating while no grounding discussion of X appears, the observer cites the turns where the user's constraints contradict the stated Y.

---

## 2. Solution-Fixation

**Description**: The user anchors to the first technically plausible approach surfaced in the session and treats subsequent discussion as implementation detail for that approach. Alternative framings are silently discarded — not rejected on merit, but never re-entered as live options. The fixation is visible when new constraints should reopen the design space but the conversation proceeds as if the anchor is settled.

**Evidence note**: Design-fixation is a well-established construct in engineering design research (Jansson & Smith, *Design Studies*, 1991). The HCI variant manifests strongly in mixed-initiative systems where the AI's first fluent response becomes the anchor. Claude-training guidance explicitly discourages anchoring on early proposals when downstream signals invalidate them.

**Mapping**: Informs the A″ `↗ framing` nudge — when the user introduces a new constraint that is inconsistent with the anchored approach yet the approach persists unchallenged, the observer surfaces the constraint/approach mismatch with cited turn references.

---

## 3. Articulation Bias

**Description**: The user expresses only the requirements they can articulate in the current vocabulary — constraints they hold tacitly but cannot (yet) name are omitted from the prompt. The AI produces output that satisfies the articulated subset and violates the unarticulated complement. The user experiences this as "technically correct but wrong in spirit" without being able to specify the missing rule.

**Evidence note**: Closely related to Polanyi's tacit knowledge (*The Tacit Dimension*, 1966) and studied in requirements engineering as implicit/tacit requirements elicitation. HCI literature: general observation that interactive systems surface tacit requirements through iteration and conflict, not through initial statement.

**Mapping**: Informs the B Aitesis Phase 0 priming heuristic, particularly the **domain constraints** and **non-functional requirements** categories — tacit constraints commonly sit in regulatory, performance, and policy dimensions that users do not spontaneously enumerate.

---

## 4. Calibration Failure

**Description**: The user either over-trusts or under-trusts the AI's output, misaligned with its actual reliability for the current task. Over-trust skips verification steps that should be gates; under-trust re-asks questions whose answers are already correct, accumulating friction. Both failure modes corrupt the session's effective information flow — one by smuggling errors past gates, the other by consuming turns on already-resolved matters.

**Evidence note**: Calibration in human-AI interaction is extensively studied — e.g., Lee & See, *Human Factors*, 2004 ("Trust in Automation: Designing for Appropriate Reliance"). Recent LLM-specific work on confidence calibration and hallucination detection extends this. Claude-training emphasizes explicit uncertainty signaling to support appropriate user calibration.

**Mapping**: Informs both runtime surfaces — the B Aitesis Phase 0 **operational lifecycle** and **failure and edge modes** categories (where miscalibration typically surfaces as unverified assumptions), and indirectly the A″ `↗ framing` nudge when calibration drift manifests as treating a prior turn's uncertain claim as settled ground in a later turn.

---

## 5. Prompt-Literacy Gap

**Description**: The user's ability to express goals in language the AI can operationalize lags behind the goals themselves. The user holds a coherent intention but renders it in phrasing that is either under-specified (producing generic output) or miscoded (producing output aligned with the surface phrasing rather than the underlying intent). The gap is not a user deficiency — it reflects the asymmetry between natural language as lived and natural language as a specification medium for machine behavior.

**Evidence note**: Emerging area in HCI — e.g., Zamfirescu-Pereira et al. CHI 2023 ("Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts"). Claude-training guidance acknowledges that charitable interpretation of under-specified prompts is a core capability, but charitable interpretation can mask the gap rather than surface it.

**Mapping**: Informs the B Aitesis Phase 0 priming heuristic broadly — commonly-missed categories (domain constraints, non-functional requirements, stakeholder perspectives) are the precise loci where prompt-literacy gaps most often manifest, because these categories require vocabulary the user may not yet have for the current domain.

---

## 6. Stakeholder-Omission

**Description**: The user frames the prospect from a single vantage point — typically their own role — and silently excludes parties whose constraints or interests shape the decision space. Downstream consumers, operators, auditors, and end users become invisible in the initial framing. The AI optimizes for the stated vantage and produces output that violates omitted-stakeholder constraints.

**Evidence note**: Stakeholder analysis is a foundational technique in requirements engineering and participatory design (e.g., Freeman's stakeholder theory, 1984; extended through HCI via value-sensitive design — Friedman et al.). HCI literature: general observation that single-role framings correlate with late-stage rework when omitted-stakeholder constraints surface.

**Mapping**: Informs the B Aitesis Phase 0 **stakeholder perspectives** category directly, and contributes to **operational lifecycle** (operators often the most-omitted stakeholder class in developer-initiated prompts).

---

## 7. Happy-Path Framing

**Description**: The prospect is specified in terms of the successful, nominal execution path — what should happen when inputs are well-formed, dependencies are available, and preconditions hold. Behavior under partial failure, degraded dependencies, adversarial input, or boundary conditions is absent from the framing. The AI produces a solution optimized for the nominal path that fails silently or catastrophically at the edges.

**Evidence note**: Long-standing observation in software engineering practice; formalized in approaches such as defensive design and property-based testing. HCI literature: general observation that novice-to-intermediate users frame prospects around the nominal path more frequently than experts, and AI-produced code inherits this framing unless edge-case prompting is explicit.

**Mapping**: Informs the B Aitesis Phase 0 **failure and edge modes** category directly.
