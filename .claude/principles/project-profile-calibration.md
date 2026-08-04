# Project Profile Calibration

Each project declares a profile that determines the default Cognitive Partnership Move mode (Extension or Constitution; see `premise/recognition-and-authority.md` and `premise/interaction-factorization.md`) for ambiguous decisions. The profile is the project's calibration of how much Phase 1 entropy reduction is feasible relative to gating cost. This mechanism specializes the `.claude/principles/architectural-principles.md §Epistemic Cost Topology` meta-layer asymmetry to the project-specific calibration dimension: the meta-layer cost gradient governs *creation* decisions for new protocols, while project profile governs *gating-default* decisions for already-existing protocols.

## Profile Variables (six) and Calibration Rule

General methodology (the six variables, their aggregate qualitative rule, and how a mixed profile classifies per-decision): `premise/calibration-methodology.md`. This project's instantiation of the Calibration Rule (low-cost profile → Extension-default): with Katalepsis (`/grasp`) serving as the comprehension-verification step plus active-use feedback as the correction channel — see `Calibration Result` in `.claude/rules/project-profile.md`.

## Scope Boundary

This mechanism calibrates *ambiguous* decisions. Decisions whose epistemic completion requires further user judgment — not substrate enforcement — remain Constitution regardless of profile (in-principle delegation impossibility within the epistemic substrate; see `premise/tiering-and-scope.md §Epistemic Completeness Boundary` for the substrate boundary).

**Floor vs bounded zone distinguishing criterion**: both involve epistemic substrate gate interaction; the split is about whether the gate's content is *runtime-discovered* (cannot be pre-committed via Standing authority pattern because the relevant condition is not knowable at protocol-definition time) or *contract-pre-committed* (pattern is pre-commitable as a project-level standing rule).

Floor instances (Constitution preserved — runtime-discovered):
- Katalepsis (`/grasp`): the user is the measurement target — comprehension is verified, not pre-committed. Retry would change the verification's identity (re-asking after seeing the answer ≠ original verification).

Bounded zone (in-principle delegatable via contract-style Standing authority + post-deploy correction):
- Horismos BoundaryMap — pre-commitable as project-level scope rules.
- Syneidesis decision pattern — pre-commitable as recurring decision templates.
- Merismos conditioned unit plan — pre-commitable as a recurring apportionment template. The `/apportion` compile-time redefinition moved Merismos here from the floor, but not because any given goal's seams and conditions are knowable at protocol-definition time — they are goal-specific and discovered fresh at Phase 1/2 scanning. What is pre-commitable is the recurring shape apportionments converge on across many autonomous goals in the same project (unit cuts that consistently land at the same kind of seam, or a completion predicate set that recurs across runs); accumulated Cross-Session Enrichment is what surfaces that shape, and a project-level Standing template could later seed the Phase 1/2 gates with it, leaving live confirmation to catch the goal-specific deviation rather than derive the apportionment from nothing. Enforcement/interception handoff: `premise/tiering-and-scope.md §Epistemic Completeness Boundary`.

Horismos / Syneidesis / Merismos are also grounded by their respective protocol-internal Constitution checkpoints — Horismos Phase 2 per-cycle satisfaction gate (with informed-default visibility for ImplicitTermination + optional ExplicitTermination → Phase 4 path for explicit residual classification), Syneidesis Phase 3 gap consideration, Merismos Phase 2 compiled-condition confirmation — providing direct enforcement of Detection with Authority at the protocol layer. Profile-layer enumeration of these protocols is therefore redundant for runtime enforcement; their inclusion in the bounded zone is for **future split-Extension migration visibility** (recording where conditional Standing-authority delegation could later be inscribed as `(extension)` TOOL GROUNDING entries), not present runtime gating.

**Operational realization deferred**: "in-principle delegatable" is a *capability* statement (Standing authority pattern would in principle cover the gate). Operational realization — adding split `(extension)` entries in TOOL GROUNDING that specialize the Constitution gate under specific runtime conditions — is deferred per-protocol pending accumulated use evidence. Current SKILL.md TOOL GROUNDING `(constitution)` annotations remain runtime-authoritative.

**Self-containment policy**: Plugin Encapsulation's self-containment requirement applies to *SKILL.md* (runtime contract surface — no rule-file or premise-file path citations); rule/principle layer files cross-reference each other freely and cite `premise/` for the general form of a principle, as the cross-document inscription pattern is normal for that layer.
