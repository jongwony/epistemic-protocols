# Project Profile Calibration

Each project declares a profile that determines the default Cognitive Partnership Move mode (Extension or Constitution; see `axioms.md` A2/A5) for ambiguous decisions. The profile is the project's calibration of how much Phase 1 entropy reduction is feasible relative to gating cost. This mechanism specializes the §Epistemic Cost Topology meta-layer asymmetry to the project-specific calibration dimension: the meta-layer cost gradient grounds Deficit Empiricism for *creation* decisions, while project profile governs *gating-default* decisions for already-existing protocols.

## Profile Variables (six)

1. **Revision cost** — labor per unit change. Lower → broader Extension scope.
2. **Deploy fan-out** — user count / dependent system count. Lower → broader Extension scope.
3. **Dependency lock-in** — external dependency / API contract surface. Less → broader Extension scope.
4. **Runtime persistence** — state durability. Lower → broader Extension scope.
5. **Hermeneutic circle availability** — dogfooding + Stage 2 frequency. Higher → richer correction channel for Extension.
6. **Notation maturity** — cost of cross-domain restructuring. Higher maturity → Extension-supportive.

## Calibration Rule

Aggregated low-cost profile → Extension-default for ambiguous gates with Katalepsis (`/grasp`) + Stage 2 active-use feedback as correction channel; aggregated high-cost profile → Constitution-tighten. The aggregate function is qualitative; projects with mixed profiles classify per-decision rather than globally.

## Scope Boundary

This mechanism calibrates *ambiguous* decisions. Decisions whose epistemic completion requires further user judgment — not substrate enforcement — remain Constitution regardless of profile (in-principle delegation impossibility within the epistemic substrate; see `architectural-principles.md §Epistemic Completeness Boundary` for the substrate boundary).

**Floor vs bounded zone distinguishing criterion**: both involve epistemic substrate gate interaction; the split is about whether the gate's content is *runtime-discovered* (cannot be pre-committed via Standing authority pattern because the relevant condition is not knowable at protocol-definition time) or *contract-pre-committed* (pattern is pre-commitable as a project-level standing rule).

Floor instances (Constitution preserved — runtime-discovered):
- Katalepsis (`/grasp`): the user is the measurement target — comprehension is verified, not pre-committed. Retry would change the verification's identity (re-asking after seeing the answer ≠ original verification).
- Prosoche `/attend` Phase 2: gate interaction over runtime-discovered risk patterns — the specific irreversibility, security boundary, or human-communication context emerges at execution time and is not pattern-pre-committable. Gate-passage actions requiring substrate enforcement (harness permission, high-stake execution) are non-epistemic substrate, delegated by handoff per the Boundary.

Bounded zone (in-principle delegatable via contract-style Standing authority + Stage 2 correction):
- Telos GoalContract — pre-commitable as project-level standing goals.
- Horismos BoundaryMap — pre-commitable as project-level scope rules.
- Syneidesis decision pattern — pre-commitable as recurring decision templates.
- Hermeneia Phase 2 articulation — pre-commitable as default-articulation rules for recurring intent patterns. Distinguished from Katalepsis floor by *retry semantics*: incorrect articulation is correctable at the next Hermeneia invocation (bounded regret), whereas Katalepsis's measurement identity precludes retry without altering the verification.

Telos / Horismos / Syneidesis are also grounded by their respective protocol-internal Constitution checkpoints — GoalContract Phase 2, boundary approval Phase 4, gap consideration Phase 3 — providing direct A2 enforcement at the protocol layer. Profile-layer enumeration of these protocols is therefore redundant for runtime enforcement; their inclusion in the bounded zone is for **future split-Extension migration visibility** (recording where conditional Standing-authority delegation could later be inscribed as `(extension)` TOOL GROUNDING entries), not present runtime gating.

**Stage 1 conjecture (operational realization deferred)**: "in-principle delegatable" is a *capability* statement (Standing authority pattern would in principle cover the gate). Operational realization — adding split `(extension)` entries in TOOL GROUNDING that specialize the Constitution gate under specific runtime conditions — is deferred to per-protocol future stages with their own Stage 2 corroboration. Current SKILL.md TOOL GROUNDING `(constitution)` annotations remain runtime-authoritative.

**Self-containment policy**: the previous design note ("inscribed inline rather than externally referenced to preserve self-containment") applied to a self-contained enumeration. With substrate-scope semantics relocated to `architectural-principles.md §Epistemic Completeness Boundary`, cross-referencing the source becomes the correct pattern. Plugin Encapsulation's self-containment requirement applies to *SKILL.md* (runtime contract surface — no rule-file path citations); `.claude/rules/` files cross-reference each other freely as the cross-document inscription pattern is normal for the rule layer.

## Cross-Project Corroboration

This mechanism defines the calibration *structure*, not the values across projects. Each project's profile declaration is independent. Cross-project variation in calibration practice — when observed — would corroborate the mechanism's structural soundness without claiming a universal value distribution; the mechanism is currently Stage 1 (structural fit) awaiting Stage 2 (accumulated use evidence) validation.
