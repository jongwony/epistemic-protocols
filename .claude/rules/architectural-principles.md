# Architectural Principles

Project structure decisions; independent of the axiom system.

## Unix Philosophy Homomorphism

Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized cost situations, not follow a prescribed pipeline. The precedence order is a logical default for multi-activation, not a mandatory sequence.

## Session Text Composition

Inter-protocol data flows as natural language in the session context — no structured data channels between protocols. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. Cell-based structured transport was considered and rejected: structuring context loses information. If structured transport becomes necessary, functor composition is the escalation path.

## Cross-Session Knowledge Composition

Reflexion-stored knowledge enriches protocol detection in subsequent sessions. This is the session-boundary extension of Session Text Composition — where intra-session data flows through conversation context, cross-session data flows through persistent memory. Each protocol's Phase 0/1 can leverage accumulated domain knowledge to narrow scan scope and improve detection precision (Tertiary hermeneutic circle).

**Formal layer boundary**: Cross-session enrichment operates as a runtime heuristic inscribed in protocol operational prose, not as a formal phase step. PHASE TRANSITIONS and TOOL GROUNDING blocks remain unchanged — enrichment does not introduce new phase transitions or tool calls. This boundary is intentional: heuristic inputs influence detection sensitivity but do not alter the protocol's formal specification.

**Pollution caveat**: Prior patterns loaded per-session may bias detection toward previously observed patterns, suppressing novel signals. The risk is not staleness (information becoming outdated) but pollution (loading itself contaminating judgment). Protocols with halt characteristics (Horismos: Rule 11 per-decision freshness, Prosoche: risk gate) naturally resist pollution; others rely on gate judgment to override prior-pattern bias.

## Dual Advisory Layer

Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Output Style nudge (runtime, session-context-dependent, deficit-type matching). These are complementary — graph.json edges encode stable architectural relationships, while nudges respond to observed session conditions. Protocol convergence moments are high-signal observation points for cross-protocol needs, but nudges are not position-constrained and fire whenever contextual evidence warrants.

**Advisory cycle convergence**: Bidirectional advisory edges (e.g., `telos ↔ prothesis`) form mutual enrichment pairs but operate under single-pass semantics — each edge fires at most once per activation. Advisory edges do not carry re-invocation semantics; the composite endomorphism converges in one pass.

**Emergent boundary annotations**: Routing hints in Emergent sections of SKILL.md (e.g., `→ /clarify`, `→ /gap` in Emergent gap types or mismatch dimensions) are dialogue interaction dynamics — potential conversational routing that emerges from user-AI turn interaction. These belong to the Output Style nudge layer, not graph.json. They do not constitute structural advisory edges and must not be formalized in graph.json.

## Coexistence over Mirroring

Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

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
