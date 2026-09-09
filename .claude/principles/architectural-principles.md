# Architectural Principles (Demoted)

Project structure decisions; independent of the axiom system.

> **Demotion zone**: load behavior for this directory is stated in `AGENTS.md` §Distinction from `.claude/rules/`, the entry document that loads alongside this file. Per-section demotion rationale is recorded in the git record (commit history / PR bodies), not restated here.

## Tier Factorization

- When assigning a principle's tier, use `premise/tiering-and-scope.md`; when choosing its loading moment, use this directory's `AGENTS.md` and the root `AGENTS.md` placement rules. A role classification does not determine loading frequency.
- When changing a loading path, preserve the principle's reach before its binding moment. Moving a file does not reclassify its obligation.

### Authority at Protocol Checkpoints

- When a recorded standing rule determines a gate's answer, derive its scope from the user's constitutive act and apply only the conditional relay path the protocol actually defines.
- When the person grants discretion among alternatives, read that grant's scope under `premise/recognition-and-authority.md` §Judgment Across Delegation. The grant authorizes judgment without making its answer deterministic.
- When a protocol requires a live user response, its TYPES, PHASE TRANSITIONS, and TOOL GROUNDING govern that checkpoint. An earlier grant or a calibration profile does not manufacture the missing answer.
- When classifying an interaction, apply `premise/interaction-factorization.md`'s single classification per case. Judge consequence and recovery separately; authority source does not establish a regret bound.

## Epistemic Cost Topology

- When deciding whether protocol machinery earns its place, apply `premise/tiering-and-scope.md` §Epistemic Cost Topology to its independent obligation and loading/maintenance cost. Use the source's bounded ablation method for subtraction; non-use alone does not settle removal.

## Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke a protocol for a recognized cost situation, not by following a prescribed pipeline. An established default ordering for multi-activation is a logical default, not a mandatory sequence.

## Session Text Composition

Data flows between interaction protocols as natural language in the shared context — not through structured data channels. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. A structured, schema-based transport was considered and rejected: structuring context loses information. If structured transport becomes necessary later, formally composing the protocols' own output/input types is the escalation path, rather than inventing an ad hoc structured channel.

**Stigmergy signal constraint**: Classification artifacts that flow between protocols carry signal only, not payload. Downstream protocols read the classification and autonomously modify their own behavior — this is behavioral stigmergy, not central prescription. Loading candidates or behavioral directives into classification entries converts the signal into payload, breaking the stigmergy pattern. Test: "Is the downstream protocol reading a signal and choosing its behavior, or following a central prescription?" Former is correct.

Composition scope: The factorization G = R(p) ∘ A applies to individual gate operations within a single protocol activation. Inter-protocol composition (sequential activation of multiple protocols) operates through `.claude/principles/architectural-principles.md §Session Text Composition` — natural language in session context, not formal gate composition. Associativity of gate operations across protocol boundaries is not claimed; each protocol's gates are independently factored.

## Cross-Session Knowledge Composition

Anamnesis's hypomnesis store persists session recall indices that enrich protocol detection in subsequent sessions. This is the session-boundary extension of Session Text Composition — where intra-session data flows through conversation context, cross-session data flows through the hypomnesis store. Each protocol's Phase 0/1 can leverage accumulated domain knowledge to narrow scan scope and improve detection precision (Tertiary hermeneutic circle; see [`hermeneutic-cycle`](hermeneutic-cycle.md)).

**Formal layer boundary**: Cross-session enrichment operates as a runtime heuristic inscribed in protocol operational prose, not as a formal phase step. PHASE TRANSITIONS and TOOL GROUNDING blocks remain unchanged — enrichment does not introduce new phase transitions or tool calls. This boundary is intentional: heuristic inputs influence detection sensitivity but do not alter the protocol's formal specification.

**Pollution caveat**: Prior patterns loaded per-session may bias detection toward previously observed patterns, suppressing novel signals. The risk is not staleness (information becoming outdated) but pollution (loading itself contaminating judgment). Protocols with halt characteristics (Horismos: Rule 11 per-decision freshness, Merismos: per-cycle re-scan against the current residual) naturally resist pollution; others rely on gate judgment to override prior-pattern bias.

## Task Externalization Boundary

- When a commitment or framing changes, preserve the committed problem and current framing in the canonical record. Carry a pointer into that record across session boundaries under `AGENTS.md` §Session-handoff routing.
- Before deferral or interruption, apply `premise/session-and-handoff.md` §Resumption Cues. Make the goal, relevant state, and intended next action recoverable; explicitly identify the next action. Re-derivable detail stays at its authoritative source, while otherwise lost state or constraints must be recorded.
- When a commitment has lost attention or its framing is stale, apply that document's recovery procedure and reconcile the record before relying on it.
- A phase transition alone requires no durable status write. Persist information for recovery or a changed commitment, rather than a running completion tally. The per-item convergence trace remains a terminal relay in session text under `premise/gate-design.md` §Convergence Evidence.
- Render the current framing through the Output Style's framing readout. That presentation rule does not determine which recovery evidence must survive a boundary.

## Reference over Copy

Handoff-boundary reference/copy criteria, extending Session Text Composition and Cross-Session Knowledge Composition above to tool/agent/turn boundaries.

When context crosses a handoff boundary — a tool boundary (a CLI subprocess), an agent boundary (a subagent or teammate), a durable-record boundary (session text surviving compaction), or a turn boundary — pass a **reference** that lets the consumer re-access the live authoritative source wherever the consumer can re-derive it, and **copy** only what the consumer cannot. The partition is **re-derivability by the consumer**: context reconstructable from shared substrate (codebase, git, runtime state, the consumer's own tools) is passed by reference (a pointer the consumer dereferences); context the consumer cannot reconstruct — the constitutive WHY and framing, an output contract, a generated artifact, user-specific intent, or a snapshot whose determinism is itself the requirement — is copied so it survives the handoff intact. Both faces are first-class; which dominates is set by how much of the handoff the consumer can re-derive.

The unifying figure is the **consumer that cannot re-derive**: an isolated subagent that cannot see the parent's context, a CLI process across a tool boundary, the post-compaction future-self. Each receives exactly what it cannot reconstruct (copy) plus pointers to everything it can (reference).

The reference face is favored by three forces — transcription cost (a copy spends tokens), staleness (a copy diverges from the source it duplicated), and fidelity (re-encoding an authoritative form is lossy). The copy face is governed by loss-avoidance alone.

This is the shared root of several existing positions rather than a new mechanism: Detection with Authority's relay mode forwards environmental facts with cited basis (a citation, not a re-constitution); the Task Externalization Boundary externalizes only the problem-to-solve and framing shifts (what the substrate cannot re-derive); Subagent Context Isolation has the coordinator point while the executor fetches its own context. On the receive side the move appears as forwarding a tool's native output unit verbatim instead of re-bucketing it into an imposed schema; on the send side as passing a pointer instead of inlining content. Both are the same move across the same boundary.

**Operational test**: "Can the consumer re-derive this from shared substrate with its own tools?" Yes → reference; no → copy. A copy where reference would serve pays tokens, risks staleness, and may lose fidelity; a reference where copy is required loses the non-re-derivable content outright.

## Inter-Protocol Guidance

Inter-protocol guidance operates through a single mechanism: runtime observation. The Output Style layer watches a session for a documented protocol deficit — a deficit type the currently-active protocol names in its own formal blocks — and, on match, surfaces a nudge (session-context-dependent, deficit-type matching). Protocol convergence moments are high-signal observation points for cross-protocol needs, but a nudge is not position-constrained and fires whenever contextual evidence warrants.

A **binding** routing relation — one that constrains where an activation may proceed, as opposed to a suggestion the user is free to disregard — is not carried by this observational layer. It is not inscribed as a named destination either. Composition is by type: each protocol declares the deficit it takes and the resolution it produces, and where a protocol carries the COMPOSITION operator those domains and codomains compose with the resolution emergent from session context. Whether a protocol carries that operator is settled by its own declared essence: where the essence names a different structural block in the operator's place, that block is where the protocol states how it composes. Nothing outside the protocol settles this, for the same reason nothing outside it settles what constrains its activation — and a protocol whose essence omits the operator without naming what stands there instead has left the question open rather than answered it. A protocol therefore states its own scope and identity — the guard, transition, or consumption point where it actually binds, read from the session's own context — and does not inscribe which protocol comes next, nor condition its activation on whether a sibling has run. Both would fix at authoring time an answer that varies with the context accumulated by the time the question is live: whether a sibling's earlier run actually discharged the matter depends on what that run produced, which is knowable only then. Each protocol's formal blocks are the sole authority for what constrains its own activation; there is no separate cross-protocol structural registry. No mechanism arbitrates between protocols: one would have to sit outside every protocol's formal blocks to reach across them, which is the structure this section forbids. Where the scopes of two protocols both reach a situation, each protocol's own gates govern.

**Emergent boundary annotations**: Routing hints in Emergent sections of SKILL.md — an arrow-and-command form naming another protocol — are dialogue interaction dynamics — potential conversational routing that emerges from user-AI turn interaction. These belong to the Output Style nudge layer, not to a protocol-local binding routing relation: a hint is suggestive, not a binding contract inscribed at a guard, transition, or consumption point.

**Definitional-Observational convergence**: AI-observation concerns without constitutive user authority (runtime detection, cross-cutting commentary, session-context nudges) have repeatedly converged into Output Style rather than SKILL.md. Observed instances (N=4): Post-Convergence traversal → Output Style nudge (archived); Integration+basis runtime display → Output Style echo format; protocol nudge arrow (↗) → Output Style session observer; Basis marker → Output Style session-level citation (deliberately placed outside per-protocol TOOL GROUNDING). Definitional structure (TYPES, FLOW, PHASE TRANSITIONS, gate interactions) lives in SKILL.md; observational commentary lives in Output Style. This convergence is not a design imposition but a recurring empirical outcome of applying the Inter-Protocol Guidance division.

**Authoring checkpoint**: Before inscribing AI-detection prose into SKILL.md, apply the test: "Does this concern require gated user constitution (differential futures, constitutive choice), or is it runtime AI observation that the user can immediately recognize or dismiss?" Gated constitution → SKILL.md. Runtime observation → Output Style. Prevents SKILL.md bloat; preserves definitional minimality against the gravitational pull of new AI-observation ideas.

## Coexistence over Mirroring

Epistemic dialogue protocols coexist with a harness's built-in execution commands as orthogonal tools occupying different layers. The epistemic layer asks whether the right thing is being done; the execution layer, whether it is being done correctly; the verification layer, whether it was understood. Protocols occupy the epistemic and verification layers, and a harness's built-in execution commands occupy the execution layer. Do not mirror built-in execution capabilities into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results only at handoff points.

## Termination

Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_withdraw` | Explicit gate option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on — a gate answer yields a turn to act in, and that turn is what makes the cleanup performable at all. A protocol holding no side-effect state needs no exit tier at all.

Circular protocol interactions are healthy dialogue rather than a hang, and the gate is what makes them so: a cycle re-entering a Constitution gate yields the turn each time, so it advances only when the user answers and cannot spin on its own.

## Plugin Encapsulation

Each `SKILL.md` is self-contained, and a principle affects runtime protocol behavior only when it is compiled into the protocol's own `SKILL.md`. Inscribing it on an upstream instruction surface alone leaves runtime behavior unchanged.

## Utility Skills — Adversarial Anticipation (Safeguard) Delegation

General principle (pure-relay utilities delegate adversarial guards to the protocols they compose; synthesis utilities inherit guards at their synthesis boundary): `premise/gate-design.md` §Utility Delegation of Adversarial Guards. This project's instance: a pure-relay utility SKILL.md may omit adversarial-guard sections and document only the composed protocol's guard inheritance; a synthesis utility must document its own adversarial-guard obligations at the synthesis boundary.
