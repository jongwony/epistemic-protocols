# Architectural Principles

Project structure decisions; independent of the axiom system.

## Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized cost situations, not follow a prescribed pipeline. The precedence order is a logical default for multi-activation, not a mandatory sequence.

## Session Text Composition

Inter-protocol data flows as natural language in the session context — no structured data channels between protocols. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. Cell-based structured transport was considered and rejected: structuring context loses information. If structured transport becomes necessary, functor composition is the escalation path.

**Stigmergy signal constraint**: Classification artifacts that flow between protocols (e.g., BoundaryMap) carry signal only, not payload. Downstream protocols read the classification and autonomously modify their own behavior — this is behavioral stigmergy, not central prescription. Loading candidates or behavioral directives into classification entries converts the signal into payload, breaking the stigmergy pattern. Test: "Is the downstream protocol reading a signal and choosing its behavior, or following a central prescription?" Former is correct.

## Cross-Session Knowledge Composition

Anamnesis's hypomnesis store persists session recall indices that enrich protocol detection in subsequent sessions. This is the session-boundary extension of Session Text Composition — where intra-session data flows through conversation context, cross-session data flows through the hypomnesis store. Each protocol's Phase 0/1 can leverage accumulated domain knowledge to narrow scan scope and improve detection precision (Tertiary hermeneutic circle).

**Formal layer boundary**: Cross-session enrichment operates as a runtime heuristic inscribed in protocol operational prose, not as a formal phase step. PHASE TRANSITIONS and TOOL GROUNDING blocks remain unchanged — enrichment does not introduce new phase transitions or tool calls. This boundary is intentional: heuristic inputs influence detection sensitivity but do not alter the protocol's formal specification.

**Pollution caveat**: Prior patterns loaded per-session may bias detection toward previously observed patterns, suppressing novel signals. The risk is not staleness (information becoming outdated) but pollution (loading itself contaminating judgment). Protocols with halt characteristics (Horismos: Rule 11 per-decision freshness, Prosoche: risk gate) naturally resist pollution; others rely on gate judgment to override prior-pattern bias.

## Dual Advisory Layer

Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Output Style nudge (runtime, session-context-dependent, deficit-type matching). These are complementary — graph.json edges encode stable architectural relationships, while nudges respond to observed session conditions. Protocol convergence moments are high-signal observation points for cross-protocol needs, but nudges are not position-constrained and fire whenever contextual evidence warrants.

**Advisory cycle convergence**: Bidirectional advisory edges (e.g., `telos ↔ prothesis`) form mutual enrichment pairs but operate under single-pass semantics — each edge fires at most once per activation. Advisory edges do not carry re-invocation semantics; the composite endomorphism converges in one pass.

**Emergent boundary annotations**: Routing hints in Emergent sections of SKILL.md (e.g., `→ /clarify`, `→ /gap` in Emergent gap types or mismatch dimensions) are dialogue interaction dynamics — potential conversational routing that emerges from user-AI turn interaction. These belong to the Output Style nudge layer, not graph.json. They do not constitute structural advisory edges and must not be formalized in graph.json.

**Definitional-Observational convergence**: AI-observation concerns without constitutive user authority (runtime detection, cross-cutting commentary, session-context nudges) have repeatedly converged into Output Style rather than SKILL.md. Observed instances (N=4): Post-Convergence traversal → Output Style nudge (archived); Integration+basis runtime display → Output Style echo format; protocol nudge arrow (↗) → Output Style session observer; Basis marker → Output Style session-level citation (deliberately placed outside per-protocol TOOL GROUNDING). Definitional structure (TYPES, FLOW, PHASE TRANSITIONS, gate interactions) lives in SKILL.md; observational commentary lives in Output Style. This convergence is not a design imposition but a recurring empirical outcome of applying the Dual Advisory Layer division.

**Authoring checkpoint**: Before inscribing AI-detection prose into SKILL.md, apply the test: "Does this concern require gated user constitution (differential futures, constitutive choice), or is it runtime AI observation that the user can immediately recognize or dismiss?" Gated constitution → SKILL.md. Runtime observation → Output Style. Prevents SKILL.md bloat; preserves definitional minimality against the gravitational pull of new AI-observation ideas.

## Coexistence over Mirroring

Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

## Epistemic Cost Topology

The epistemic meta-layer has a fundamentally different cost topology from the execution layer. In the execution layer (code, tests, docs), AI drives the marginal cost of completeness toward zero — pursuing completeness is correct. In the epistemic meta-layer (protocols, axioms, formal systems), unused protocols pollute cognitive space — the cost of an unused protocol exceeds the cost of a missing one. This asymmetry grounds Deficit Empiricism: empirical restraint is the correct posture for protocol creation, even when execution-layer intuitions suggest "why not create more?" Attempts to apply execution-domain completeness principles directly to the epistemic domain should be identified and the cost function difference surfaced.

**Phenomenological vindication**: This principle's asymmetry survives Husserlian eidetic reduction. It corresponds to Husserl's distinction between thematic consciousness (what attention is directed at) and marginal consciousness (what remains in the co-given field) — the asymmetry is not a pragmatic design choice but a reflection of the finitude of attentional capacity. Under Extended Mind framing (Clark & Chalmers, *Analysis* 58:7-19, 1998), this reflects the finite capacity of the extended cognitive workspace: adding unused cognitive tools pollutes the workspace even when each tool is individually valid, because attentional cost does not distinguish invoked from uninvoked candidates. See `docs/audit-2026-04-11.md` §Positive Findings P5.

## Three-Tier Termination

Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_esc` | Esc key at gate (tool-level or free-response turn) | None (ungraceful) | All protocols — universal |
| `user_withdraw` | Explicit gate option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types, not tool-level escape. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on. Protocols without termination side effects need only `user_esc`. Circular protocol interactions (e.g., boundary redefinition loops) are healthy dialogue — `user_esc` guarantees termination at every moment.

## Audience Reach

CLAUDE.md principles guide contributors (protocol designers). End users receive only SKILL.md content via the plugin system. For a principle to affect runtime protocol behavior, it must be structurally embedded in SKILL.md — documenting it in CLAUDE.md alone is insufficient.

**Session-level observer exception**: The Dual Advisory Layer principle establishes Output Style nudge as a legitimate runtime mechanism complementary to graph.json. Nudge operates as a session-level cross-cutting observer — it belongs to no single SKILL.md because it observes across all protocols. Audience Reach applies to protocol-specific runtime behavior (which must be embedded in that protocol's SKILL.md), not to session-level observation patterns that are architecturally cross-cutting. Each SKILL.md governs its own protocol's detection (e.g., Post-Convergence conditions); Output Style governs the session-level observation layer.

### Amendment: Bidirectional Reach

The original Audience Reach principle addresses leakage FROM contributor-facing text INTO LLM-runtime context. The reverse direction — LLM-runtime text leaking into contributor docs — is a symmetric failure mode.

**Bidirectional rule**: audience partitioning is symmetric. Contributor docs must not assume runtime state; runtime text must not assume contributor-onboarding context.

**Static-check candidate**: structural-specs can detect reverse-leakage by flagging contributor-doc sections that reference runtime-only symbols (mode state variables, protocol internal invariants).

## Utility Skills — A7 Delegation

**Pure relay utilities** — utilities that do NOT present gates and do NOT synthesize protocol outputs — delegate A7 (Adversarial Anticipation) to the composed protocols they call. A pure-relay utility is not obligated to implement A7 gate-integrity guards when it has no gates of its own.

**Principle**: A7 guards attach to the gate boundary, not to every wrapper layer. Wrapping a protocol in a pure-relay utility skill does NOT require re-implementing A7 in the utility.

**Scope boundary**: This delegation applies only to utilities that behave as relay pipes (forward outputs unchanged). Utilities that perform **output synthesis or post-processing** — selecting among, merging, or narratively recomposing protocol outputs — exercise constitutive authority (A2 constitution territory) and must inherit A7 adversarial guards against the same rationalization paths the synthesis step introduces. The operational test: "Does the utility's output-layer add selection, interpretation, or composition beyond forwarding?" If yes, A7 applies at the synthesis step even if no formal gate is presented.

**Implication**: Pure-relay utility SKILL.md authoring may omit A7 sections; document only the composed protocol's A7 inheritance. Synthesis utilities must document their A7 obligations at the synthesis boundary.

## Direction over Accumulated Workload

Contributors are not bound by accumulated workload (prior commits, SKILL.md size, co-change ripple, documentation pages) when evaluating a protocol direction. When the direction is theoretically justified — axiom coherence, type soundness, formal block integrity — full rewrites, large refactorings, and invalidation of prior contributions are legitimate choices. Contributor **authoring labor** converges toward zero under AI-assisted editing; **verification labor** remains bounded but non-zero and must be budgeted explicitly. The principle applies to authoring decisions; verification overhead does not vanish and constrains refactor scope through bounded investment reasoning. Structural misalignment accumulates and pollutes all downstream contributions regardless.

**Bounded by Deficit Empiricism, audience-scoped to contributors**: Theoretical rigor refers to coherence of existing structure (typed soundness, cross-reference integrity, formal block consistency), not structural expansion. New axioms, protocols, or categories still require observed deficit instances (N≥3) per the meta-principle — over-categorization is itself workload that pollutes epistemic space. This principle applies only to protocol designers; end users interacting with SKILL.md are governed by the original Epistemic Cost Topology formulation (execution-layer cost → 0 for the user). Contributors disregard their own workload precisely to preserve that user-facing minimization.

Operational test: "Is the resistance to this refactor grounded in accumulated work, or in observed structural deficit?" Former → this principle applies (proceed). Latter, when the structural deficit meets Deficit Empiricism's N≥3 threshold → halt and investigate. When both grounds co-occur, the structural deficit arm dominates: halt regardless of accumulated work investment. A single observed deficit instance (N<3) does not halt but should be recorded as a candidate pattern toward the threshold — the refactor may proceed while the deficit observation accumulates toward the meta-principle's activation.
