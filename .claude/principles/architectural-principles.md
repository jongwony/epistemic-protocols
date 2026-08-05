# Architectural Principles (Demoted)

Project structure decisions; independent of the axiom system.

> **Demotion zone**: load behavior for this directory is stated in `AGENTS.md` §Distinction from `.claude/rules/`, the entry document that loads alongside this file. Per-section demotion rationale is recorded in the git record (commit history / PR bodies), not restated here.

## Tier Factorization

Tier-classified artifacts in this project factor into a product of two orthogonal axes: an **epistemological** axis (axis_α — derivation status, model-improvement trajectory) and an **operational** axis (axis_β — invocation frequency, load-bearing strength). Neither dimension subsumes the other; the same artifact carries both annotations independently, and movement along one axis is independent of movement along the other.

The factorization is realized by complementary mechanisms. File content typically carries axis_α — a `premise/` document carries the Axiom-tier classification by what it contains. Directory location or annotation typically carries axis_β — `.claude/rules/` realizes the T1 zone and `.claude/principles/` the T2–T3 zone, each through its own load mechanism (stated in `AGENTS.md` §Distinction from `.claude/rules/`). The same axis_α value can occupy either zone depending on observed invocation frequency. Lazy-load mechanisms operate on axis_β alone; demoted content retains its axis_α classification.

**Observed instances**:
- Gate annotations: the coordination note in `### Authority Mode: Standing/Active` below distinguishes Standing/Active authority (axis_α) from regret (axis_β) at the meta/design layer; the runtime annotation layer collapses to a single TOOL GROUNDING `(extension)`/`(constitution)` axis, the two being coextensive there.
- Principle classification: `.claude/rules/` (T1) versus `.claude/principles/` (T2–T3) directly realizes the factorization for prescriptive content.
- Tier-changing moves: e-tier reclassification (Axiom → Safeguard) and o-tier compression (content reduction) operate as independent moves — see `.claude/principles/safeguards.md` Adversarial Anticipation tier note.

Sibling concept to Interaction Kind Factorization (`premise/interaction-factorization.md`): that axiom factors gate operations into Extension/Constitution × bounded/unbounded; Tier Factorization factors tier classifications into axis_α × axis_β.

### Authority Mode: Standing/Active

The axis_α × axis_β observed-instance example above, materialized in full.

Detection with Authority (`premise/recognition-and-authority.md`) extends to a second order: not only WHO exercises judgment (1st order — AI detects, User judges), but HOW authority is allocated between pre-committed rules and live judgment (2nd order).

Gate authority decomposes into two modes:

- **Standing authority**: User's constitutive judgment crystallized into deterministic rules — system prompts, compose automation, CI/CD configurations. Operates in the Extension domain (entropy→0).
- **Active authority**: User's live constitutive judgment exercised at protocol gates. Operates in the Constitution domain (entropy>0).

The act of creating Standing authority — writing a system prompt rule, configuring a CI/CD gate, defining compose elision — is itself an Active authority exercise: User's conscious choice to delegate specific gate decisions to pre-committed rules. This self-referential grounding (2nd order → 1st order) ensures Standing authority is always traceable to a constitutive act.

**Boundary protection at 2nd order**: Detection with Authority protects authority allocation visibility, not gate exclusivity. Standing authority operating within its explicitly delegated scope is compatible with it — the delegation was User's conscious choice. Standing authority exceeding delegated scope into constitution territory violates it. The operational test: "Was this Standing authority scope explicitly established by User's constitutive act?"

**Configurable relay/constitution boundary**: The relay/constitution boundary is not fixed at protocol definition time — User can shift it by creating or revoking Standing authority. TOOL GROUNDING entries map to this model: `(extension)` markers identify gates delegated to Standing authority (relay-eligible); `(constitution)` markers identify gates requiring Active authority. Conditional specialization is recorded per Interaction Kind Factorization's single annotation axis (`premise/interaction-factorization.md`).

**Coordination with Interaction Kind Factorization**: Standing/Active is an authority-source dimension; that axiom's regret dimension (bounded/unbounded) is coextensive with the operational classification, up to its structural exceptions. The two dimensions are conceptually distinguishable at the meta/design layer (per this section's axis_α × axis_β observed instances) but collapse at the runtime annotation layer, per its single annotation axis.

## Epistemic Cost Topology

Full text: `premise/tiering-and-scope.md`. This project's specialization: unused *protocols* (not just unused mechanisms in general) pollute cognitive space, and `project-profile-calibration.md` depends on this meta/execution asymmetry — do not delete this section, demote further only past that dependency.

## Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke a protocol for a recognized cost situation, not by following a prescribed pipeline. An established default ordering for multi-activation is a logical default, not a mandatory sequence.

## Session Text Composition

Data flows between interaction protocols as natural language in the shared context — not through structured data channels. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. A structured, schema-based transport was considered and rejected: structuring context loses information. If structured transport becomes necessary later, formally composing the protocols' own output/input types is the escalation path, rather than inventing an ad hoc structured channel.

**Stigmergy signal constraint**: Classification artifacts that flow between protocols (e.g., BoundaryMap) carry signal only, not payload. Downstream protocols read the classification and autonomously modify their own behavior — this is behavioral stigmergy, not central prescription. Loading candidates or behavioral directives into classification entries converts the signal into payload, breaking the stigmergy pattern. Test: "Is the downstream protocol reading a signal and choosing its behavior, or following a central prescription?" Former is correct.

Composition scope: The factorization G = R(p) ∘ A applies to individual gate operations within a single protocol activation. Inter-protocol composition (sequential activation of multiple protocols) operates through `.claude/principles/architectural-principles.md §Session Text Composition` — natural language in session context, not formal gate composition. Associativity of gate operations across protocol boundaries is not claimed; each protocol's gates are independently factored.

## Cross-Session Knowledge Composition

Anamnesis's hypomnesis store persists session recall indices that enrich protocol detection in subsequent sessions. This is the session-boundary extension of Session Text Composition — where intra-session data flows through conversation context, cross-session data flows through the hypomnesis store. Each protocol's Phase 0/1 can leverage accumulated domain knowledge to narrow scan scope and improve detection precision (Tertiary hermeneutic circle; see [`hermeneutic-cycle`](hermeneutic-cycle.md)).

**Formal layer boundary**: Cross-session enrichment operates as a runtime heuristic inscribed in protocol operational prose, not as a formal phase step. PHASE TRANSITIONS and TOOL GROUNDING blocks remain unchanged — enrichment does not introduce new phase transitions or tool calls. This boundary is intentional: heuristic inputs influence detection sensitivity but do not alter the protocol's formal specification.

**Pollution caveat**: Prior patterns loaded per-session may bias detection toward previously observed patterns, suppressing novel signals. The risk is not staleness (information becoming outdated) but pollution (loading itself contaminating judgment). Protocols with halt characteristics (Horismos: Rule 11 per-decision freshness, Merismos: per-cycle re-scan against the current residual) naturally resist pollution; others rely on gate judgment to override prior-pattern bias.

## Task Externalization Boundary

Session-boundary durable-record externalization criteria, complementing Cross-Session Knowledge Composition above.

Recognition over Recall (`premise/recognition-and-authority.md`) enters through one channel only — the framing the user reasons with must be recognizable rather than recalled — and not through the re-derivation argument below, which rests on offloading cost-sensitivity, not on Recognition.

Externalize to the durable record only two things: (1) the problem — or commitment — the session must solve, and (2) framing shifts, recorded on each framing or work-unit change so they survive interruption and context compaction. Everything else — dependencies, sub-steps, granular progress — stays in session. As models improve, in-session retention with cheap re-derivation dominates bookkeeping: a model can re-derive its own sub-steps and dependency order on demand, so capturing them externally pays the capture, review, and reacquisition cost while the offloading benefit it would otherwise buy (below) does not accrue to a record the substrate can already regenerate. The durable record is reserved for what the session genuinely cannot reconstruct from the substrate: the committed problem and the framing under which it is being solved.

The two externalized items connect to the axiom basis directly. The problem-to-solve is the commitment the substrate cannot re-derive — losing it loses the session's purpose, the one thing delegation (the Epistemic Completeness Boundary) cannot recover. Framing shifts are the constitutive frame under which work proceeds; a frame change silently dropped corrupts every downstream judgment, and the user must be able to recognize the frame in force rather than recall a frame that has since moved.

**Trigger discipline is EVENT-based, not phase-boundary.** The record is updated on a framing or work-unit change — the event that alters what the session is solving or how it is framed — not on phase entry/exit. Blind phase logging (a durable write at every phase boundary regardless of whether the framing moved) adds extraneous capture, review, and reacquisition load: it externalizes bookkeeping the model can re-derive, taxing the very working memory offloading is meant to relieve. Phase boundaries that carry no framing change produce no durable write.

**The boundary owns what crosses, not how it renders.** This principle governs what reaches the durable record. How the durable surface is then rendered to the user — a framing readout of the kind of work in play, not a progress bar, percentage, or completion tally — is realized one layer down at the Output Style, per the Epistemic Completeness Boundary's principle/realization split. The only constraint the principle itself contributes is that progress bookkeeping does not cross into the durable record; fixing the rendering vocabulary belongs to the realization layer, not here.

**Convergence evidence is a terminal relay, not the in-flight surface.** The per-item transformation trace required at convergence (`premise/gate-design.md §Convergence Evidence`) is a one-time end-of-protocol relay in session text, enumerating each resolved deficit to demonstrate the morphism completed. It is distinct from the durable status surface this boundary governs: the no-completion-tally reading applies to the in-flight surface, not to this terminal trace, so the two principles govern different moments and do not conflict.

**Safety valve**: a blocker discovered mid-session that the model cannot re-derive from the substrate — a non-reconstructable external constraint, a credential gap, an irreversible state it has already entered — is included in the framing record. The boundary test is re-derivability from the substrate (codebase, branch, runtime state, and the model's own reconstruction), not the item's grain: it excludes re-derivable bookkeeping, not genuinely lost-on-interruption facts, so when a sub-step graduates into a non-re-derivable commitment it crosses into the externalized set.

Evidence review externalized to `docs/analysis/task-externalization-evidence.md`.

## Reference over Copy

Handoff-boundary reference/copy criteria, extending Session Text Composition and Cross-Session Knowledge Composition above to tool/agent/turn boundaries.

When context crosses a handoff boundary — a tool boundary (a CLI subprocess), an agent boundary (a subagent or teammate), a durable-record boundary (session text surviving compaction), or a turn boundary — pass a **reference** that lets the consumer re-access the live authoritative source wherever the consumer can re-derive it, and **copy** only what the consumer cannot. The partition is **re-derivability by the consumer**: context reconstructable from shared substrate (codebase, git, runtime state, the consumer's own tools) is passed by reference (a pointer the consumer dereferences); context the consumer cannot reconstruct — the constitutive WHY and framing, an output contract, a generated artifact, user-specific intent, or a snapshot whose determinism is itself the requirement — is copied so it survives the handoff intact. Both faces are first-class; which dominates is set by how much of the handoff the consumer can re-derive.

The unifying figure is the **consumer that cannot re-derive**: an isolated subagent that cannot see the parent's context, a CLI process across a tool boundary, the post-compaction future-self. Each receives exactly what it cannot reconstruct (copy) plus pointers to everything it can (reference).

The reference face is favored by three forces — transcription cost (a copy spends tokens), staleness (a copy diverges from the source it duplicated), and fidelity (re-encoding an authoritative form is lossy). The copy face is governed by loss-avoidance alone.

This is the shared root of several existing positions rather than a new mechanism: Detection with Authority's relay mode forwards environmental facts with cited basis (a citation, not a re-constitution); the Task Externalization Boundary externalizes only the problem-to-solve and framing shifts (what the substrate cannot re-derive); Subagent Context Isolation has the coordinator point while the executor fetches its own context. On the receive side the move appears as forwarding a tool's native output unit verbatim instead of re-bucketing it into an imposed schema; on the send side as passing a pointer instead of inlining content. Both are the same move across the same boundary.

**Operational test**: "Can the consumer re-derive this from shared substrate with its own tools?" Yes → reference; no → copy. A copy where reference would serve pays tokens, risks staleness, and may lose fidelity; a reference where copy is required loses the non-re-derivable content outright.

Falsifiability and tier analysis externalized to `docs/analysis/task-externalization-evidence.md`.

## Dual Advisory Layer

Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Output Style nudge (runtime, session-context-dependent, deficit-type matching). These are complementary — graph.json edges encode stable architectural relationships, while nudges respond to observed session conditions. Protocol convergence moments are high-signal observation points for cross-protocol needs, but nudges are not position-constrained and fire whenever contextual evidence warrants.

**Advisory cycle convergence**: Bidirectional advisory edges form mutual enrichment pairs but operate under single-pass semantics — each edge fires at most once per activation. Advisory edges do not carry re-invocation semantics; the composite endomorphism converges in one pass.

**Emergent boundary annotations**: Routing hints in Emergent sections of SKILL.md (e.g., `→ /gap`, `→ /inquire` in Emergent gap types or mismatch dimensions) are dialogue interaction dynamics — potential conversational routing that emerges from user-AI turn interaction. These belong to the Output Style nudge layer, not graph.json. They do not constitute structural advisory edges and must not be formalized in graph.json.

**Definitional-Observational convergence**: AI-observation concerns without constitutive user authority (runtime detection, cross-cutting commentary, session-context nudges) have repeatedly converged into Output Style rather than SKILL.md. Observed instances (N=4): Post-Convergence traversal → Output Style nudge (archived); Integration+basis runtime display → Output Style echo format; protocol nudge arrow (↗) → Output Style session observer; Basis marker → Output Style session-level citation (deliberately placed outside per-protocol TOOL GROUNDING). Definitional structure (TYPES, FLOW, PHASE TRANSITIONS, gate interactions) lives in SKILL.md; observational commentary lives in Output Style. This convergence is not a design imposition but a recurring empirical outcome of applying the Dual Advisory Layer division.

**Authoring checkpoint**: Before inscribing AI-detection prose into SKILL.md, apply the test: "Does this concern require gated user constitution (differential futures, constitutive choice), or is it runtime AI observation that the user can immediately recognize or dismiss?" Gated constitution → SKILL.md. Runtime observation → Output Style. Prevents SKILL.md bloat; preserves definitional minimality against the gravitational pull of new AI-observation ideas.

## Coexistence over Mirroring

Epistemic dialogue protocols coexist with a harness's built-in execution commands as orthogonal tools occupying different layers. The epistemic layer asks whether the right thing is being done; the execution layer, whether it is being done correctly; the verification layer, whether it was understood. Protocols occupy the epistemic and verification layers, and a harness's built-in execution commands occupy the execution layer. Do not mirror built-in execution capabilities (e.g., workspace isolation, publishing a change) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results only at handoff points.

## Three-Tier Termination

Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_esc` | Esc key at gate (tool-level or free-response turn) | None (ungraceful) | All protocols — universal |
| `user_withdraw` | Explicit gate option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types, not tool-level escape. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on. Protocols without termination side effects need only `user_esc`. Circular protocol interactions (e.g., boundary redefinition loops) are healthy dialogue — `user_esc` guarantees termination at every moment.

## Plugin Encapsulation

Each `SKILL.md` is self-contained, and a principle affects runtime protocol behavior only when it is compiled into the protocol's own `SKILL.md`. Inscribing it on an upstream instruction surface alone leaves runtime behavior unchanged.

## Utility Skills — Adversarial Anticipation (Safeguard) Delegation

General principle (pure-relay utilities delegate adversarial guards to the protocols they compose; synthesis utilities inherit guards at their synthesis boundary): `premise/gate-design.md` §Utility Delegation of Adversarial Guards. This project's instance: a pure-relay utility SKILL.md may omit adversarial-guard sections and document only the composed protocol's guard inheritance; a synthesis utility must document its own adversarial-guard obligations at the synthesis boundary.
