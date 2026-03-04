# Isolation Rationale

**Mode 2 (inquire) only.** Mode 1 (recommend) terminates before Phase 3 — see Rule 3.

Each perspective MUST be analyzed in **isolated teammate context** to prevent:
- Cross-perspective contamination from shared conversation history
- Confirmation bias from main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

**Structural necessity**: Only teammates in an agent team provide fresh context—main agent retains full conversation history. Therefore, perspective analysis MUST be delegated to separate teammates. This is not a stylistic preference; it is architecturally required for epistemically valid multi-perspective analysis. **Phase-dependent isolation**: In Phase 3 (inquiry), perspectives operate in strict isolation — no cross-dialogue occurs. In Phase 4 (cross-dialogue), peers negotiate directly on coordinator-identified tension topics (≤3 exchanges per pair), then submit structured reports. If divergence remains, the coordinator queries each divergent peer once (hub-spoke) before synthesizing independently (see Phase 4 for coordinator role details).

**Isolation trade-off on extend loops**: When `J=extend` deepens an existing perspective via SendMessage, the coordinator's re-inquiry instruction inherently carries synthesis context (what to deepen, why). This introduces controlled cross-pollination — the teammate gains partial awareness of other perspectives' findings. This is acceptable because: (1) the user explicitly requested extension, sanctioning the trade-off; (2) the coordinator controls what information crosses the boundary; (3) fresh initial analysis was already completed in full isolation.

**Isolation trade-off on cross-dialogue phase**: Phase 4 allows peer-to-peer communication. This is acceptable because: (1) Phase 3 already secured independent analysis — isolation has served its epistemic purpose; (2) direct peer exchange produces richer negotiation than coordinator relay, which introduces State-Cognition Gap (information loss at each transfer layer); (3) the coordinator retains structural control — topic signaling, structured report collection, conditional hub-spoke — without acting as message intermediary during peer exchange. Hub-spoke is a controlled reversion to coordinator-mediated interaction, justified by the need for independent synthesis when peers cannot resolve divergence themselves.
