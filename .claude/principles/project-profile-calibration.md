# Project Profile Calibration

Each project declares a profile that determines the default Cognitive Partnership Move mode (Extension or Constitution; see `.claude/rules/axioms.md` A2/A5) for ambiguous decisions. The profile is the project's calibration of how much Phase 1 entropy reduction is feasible relative to gating cost. This mechanism specializes the `.claude/principles/architectural-principles.md §Epistemic Cost Topology` meta-layer asymmetry to the project-specific calibration dimension: the meta-layer cost gradient governs *creation* decisions for new protocols, while project profile governs *gating-default* decisions for already-existing protocols.

## Profile Variables (six)

1. **Revision cost** — labor per unit change. Lower → broader Extension scope.
2. **Deploy fan-out** — user count / dependent system count. Lower → broader Extension scope.
3. **Dependency lock-in** — external dependency / API contract surface. Less → broader Extension scope.
4. **Runtime persistence** — state durability. Lower → broader Extension scope.
5. **Hermeneutic circle availability** — dogfooding + post-deploy correction frequency. Higher → richer correction channel for Extension.
6. **Notation maturity** — cost of cross-domain restructuring. Higher maturity → Extension-supportive.

## Calibration Rule

Aggregated low-cost profile → Extension-default for ambiguous gates with Katalepsis (`/grasp`) + active-use feedback as correction channel; aggregated high-cost profile → Constitution-tighten. The aggregate function is qualitative; projects with mixed profiles classify per-decision rather than globally.

## Scope Boundary

This mechanism calibrates *ambiguous* decisions. Decisions whose epistemic completion requires further user judgment — not substrate enforcement — remain Constitution regardless of profile (in-principle delegation impossibility within the epistemic substrate; see `.claude/rules/architectural-principles.md §Epistemic Completeness Boundary` for the substrate boundary).

**Floor vs bounded zone distinguishing criterion**: both involve epistemic substrate gate interaction; the split is about whether the gate's content is *runtime-discovered* (cannot be pre-committed via Standing authority pattern because the relevant condition is not knowable at protocol-definition time) or *contract-pre-committed* (pattern is pre-commitable as a project-level standing rule).

Floor instances (Constitution preserved — runtime-discovered):
- Katalepsis (`/grasp`): the user is the measurement target — comprehension is verified, not pre-committed. Retry would change the verification's identity (re-asking after seeing the answer ≠ original verification).

Bounded zone (in-principle delegatable via contract-style Standing authority + post-deploy correction):
- Horismos BoundaryMap — pre-commitable as project-level scope rules.
- Syneidesis decision pattern — pre-commitable as recurring decision templates.
- Prosoche compiled-condition set — pre-commitable as recurring guardrail templates. The `/attend` compile-time redefinition moved Prosoche here from the floor: its Phase 2 gate confirms a condition set compiled from boundary signal kinds knowable at protocol-definition time (scope, budget, completion threshold, end-state-checkable irreversibility), not runtime-discovered execution actions. Enforcement/interception handoff: `.claude/rules/architectural-principles.md §Epistemic Completeness Boundary`.

Horismos / Syneidesis / Prosoche are also grounded by their respective protocol-internal Constitution checkpoints — Horismos Phase 2 per-cycle satisfaction gate (with informed-default visibility for ImplicitTermination + optional ExplicitTermination → Phase 4 path for explicit residual classification), Syneidesis Phase 3 gap consideration, Prosoche Phase 2 compiled-condition confirmation — providing direct A2 enforcement at the protocol layer. Profile-layer enumeration of these protocols is therefore redundant for runtime enforcement; their inclusion in the bounded zone is for **future split-Extension migration visibility** (recording where conditional Standing-authority delegation could later be inscribed as `(extension)` TOOL GROUNDING entries), not present runtime gating.

**Operational realization deferred**: "in-principle delegatable" is a *capability* statement (Standing authority pattern would in principle cover the gate). Operational realization — adding split `(extension)` entries in TOOL GROUNDING that specialize the Constitution gate under specific runtime conditions — is deferred per-protocol pending accumulated use evidence. Current SKILL.md TOOL GROUNDING `(constitution)` annotations remain runtime-authoritative.

**Self-containment policy**: With substrate-scope semantics relocated to `.claude/rules/architectural-principles.md §Epistemic Completeness Boundary`, cross-referencing the source becomes the correct pattern. Plugin Encapsulation's self-containment requirement applies to *SKILL.md* (runtime contract surface — no rule-file path citations); rule/principle layer files cross-reference each other freely as the cross-document inscription pattern is normal for that layer.
