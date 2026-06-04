---
name: reduced-space-test
description: "Scoped empirical validation utility. Decomposes a target↔surrogate equivalence claim into verifiable facets, bounds a user-synchronized test space, captures evidence inside it, and carries the uncovered complement forward. Use when an inference-uncertain proposition (does it behave / perform / transfer / hold value) needs evidence in a smaller stand-in space, and you want the claim scoped to the conditions actually tested rather than asserted absolutely."
---

# Reduced-Space Test: Scoped Empirical Validation

Validate an inference-uncertain proposition inside a constraint-bounded stand-in space synchronized with the user, obtain a scoped resolution ("within these conditions, whether it holds, fails, or remains inconclusive"), and carry the uncovered complement forward to a follow-up protocol. This skill does not run the experiment substrate, open branches, or create PRs. It orchestrates existing protocols around one disciplined empirical move.

**This is an orchestration utility, not a runtime executor and not a new epistemic protocol.** Reduced-Space Test introduces no new interaction deficit. It realizes a known composite — decompose the target↔surrogate equivalence claim into verifiable facets, then `/bound` a synchronized test space (+ residual) ∘ `/inquire` for evidence inside it → scoped resolution + carried complement. It is sibling to `/triage`, `/dispatch`, and `/forge`: a thin composition over existing protocols, kept out of the protocol graph because it owns no deficit of its own.

The core recognition act is **decomposing the equivalence claim into verifiable facets** — not "creating a reduced space." A stand-in space is only as good as the facets on which it is claimed equivalent to the target; the value lives in making those facets explicit and observable.

## Core Contract

`/reduced-space-test` owns scoped empirical validation:

```
InferenceUncertainClaim
  -> ScopedClaimFrame       (core: decompose target↔surrogate equivalence into verifiable facets)
  -> BoundedTestSpace       (/bound: user-synchronized in-scope space + residual complement)
  -> EmpiricalEvidence      (/inquire: observe inside the bounded space, evidence over inference)
  -> ScopedResolution | CoverageShortfall   (scoped outcome — holds, fails, or inconclusive — within the claim's defined conditions; or, on under-coverage, a CoverageShortfall: slice-scoped resolution or no resolution, with the remainder re-bounded or carried)
  -> Residual               (uncovered complement -> follow-up protocol)
```

The orchestration produces two first-class outputs: a **scoped resolution** (the proposition's outcome — holds, fails, or inconclusive — within the tested conditions) and a **carried residual** (the complement the test did not cover). Neither stands without the other — a scoped resolution that hides its residual overclaims.

## Types

| Type | Meaning |
|---|---|
| `InferenceUncertainClaim` | A proposition about behavior, performance, transfer, or value that inference alone cannot settle and that the user wants grounded in evidence. |
| `EquivalenceClaim` | The asserted target-environment ↔ surrogate-space equivalence the test rests on. The test is only valid on the facets where this equivalence is itself examined. |
| `VerifiableFacet` | One decomposed, observable dimension of the equivalence claim — a place where target and surrogate can be compared and a gap measured. |
| `ScopedClaimFrame` | The Phase 1 output: the decomposed set of `VerifiableFacet`s the test will and will not speak to — critical facets, the surrogate↔target difference inventory, influence-path hypotheses, and the chosen gap-measurement approach. Surfaced for user recognition before it constrains the boundary; it is what keeps the later evidence sentence honest. |
| `BoundedTestSpace` | The in-scope validation space defined with the user through `/bound`, paired with its residual complement. The space's definition is what constitutes the verifiable claim. |
| `Residual` | The complement the bounded space does not cover. A first-class output, carried forward, never dropped. |
| `EmpiricalEvidence` | Observation captured inside the bounded test space through `/inquire` — evidence with cited basis, scoped to the conditions actually exercised. |
| `ScopedResolution` | The scoped outcome within the bounded space on the tested facets: the proposition holds, fails, or remains inconclusive — stated as an updated failure probability within the defined conditions (lower on confirmation, higher on disconfirmation), never a bare "it works". A disconfirming or inconclusive result is a first-class resolution, not a loop failure. |
| `CoverageShortfall` | The typed outcome when the bounded space turns out narrower than the claim it must license (under-coverage): no `ScopedResolution` is issued for the full claim; the honest exit re-scopes the resolution to the slice actually covered (resolution over the slice + the uncovered remainder carried as `Residual`) or re-bounds the space (→ Phase 2). A bounded exit, never an implicit retry. |

## Composition

Reduced-Space Test orchestrates existing protocols; most per-step work is delegated to them, while this skill owns the Phase 1 facet decomposition outright, plus the sequencing and the scoping discipline across the protocols it composes.

```
(conditional front) /elicit | /induce                              Phase 0
   -> decompose equivalence claim into facets [owned: ScopedClaimFrame]  Phase 1
   -> /bound      [BoundaryUndefined -> DefinedBoundary, + residual]  Phase 2
   -> /inquire    [ContextInsufficient -> InformedExecution, Observe]  Phase 3
   -> residual carry-forward (/inquire | /elicit)                      Phase 4
```

`/bound` natively emits a boundary plus its residual, so the complement is produced by the bound step itself rather than bolted on afterward. `/inquire` natively captures observation evidence under a scope-covers-claim discipline, so the empirical step reuses that grounding rather than re-deriving it.

## Phase 0: Intake + Name the Pattern (conditional)

Read the `InferenceUncertainClaim`: the proposition the user cannot settle by reasoning alone, and why evidence in a stand-in space is wanted.

Front with a crystallization step only when the test intent is genuinely under-formed:

- If the test intent is aporetic — the user senses an unknown but cannot yet state the proposition — front with `/elicit` (Euporia) to surface it.
- If the test pattern recurs but is unnamed — the same stand-in-validation shape appears across cases without a handle — front with `/induce` (Periagoge) to crystallize it.

When the proposition is already stated and the pattern is familiar, proceed directly to Phase 1. The front step is a conditional affordance, not a mandatory gate.

## Phase 1: Decompose the Equivalence Claim into Facets

This is the core act. The test rests on an `EquivalenceClaim` — that the surrogate space stands in for the target on the dimensions that matter. Make that claim observable:

- **Surface critical facets**: the dimensions on which the proposition's truth in the target depends (behavior, load, distribution, configuration, value).
- **Inventory surrogate↔target differences**: where the stand-in space diverges from the target, named rather than assumed away.
- **Hypothesize influence paths**: how each difference could change the outcome, so the test targets the differences that matter.
- **Choose a gap-measurement approach**: the means by which the surrogate-to-target gap is observed (for example randomization across conditions, shadowing live input, or a staged canary), selected for the facets in play.

The output is a `ScopedClaimFrame`: the facets that the test will and will not speak to. This frame is what keeps the later evidence sentence honest.

**Surface the frame for recognition before it constrains the boundary.** The facet set is an AI-formed hypothesis, not a settled determination — present it to the user as a structured, recognizable set (the critical facets, the surrogate↔target differences, and what is deliberately out of frame), with an explicit Emergent probe: *is any decision-relevant facet missing, and are these the dimensions that actually matter?* The user confirms, extends, or reweights the frame. Because the facet decomposition is the act that shapes where the test's attention goes — and that frame licenses every later claim — letting the AI fix it silently would inject attention bias at the root; surfacing it for recognition keeps the choice of which facets count with the user.

## Phase 2: Bound the Test Space (compose /bound)

Compose `/bound` (Horismos: `BoundaryUndefined -> DefinedBoundary`) to define the `BoundedTestSpace` with the user and to emit its `Residual` complement in the same move.

**Constraint sync is a Constitution interaction.** The user defines the reduced space, and that definition *constitutes the verifiable claim* — testing "does the API respond" and testing "does the API sustain its rated throughput" are different reduced spaces that license different claims. The boundary the user draws is therefore not a mechanical narrowing; it determines what the eventual resolution is allowed to assert. Surface the facet frame from Phase 1 so the user draws the boundary in recognition of what each cut includes and excludes.

`/bound` returns the in-scope space and the residual together; carry both forward.

## Phase 3: Capture Empirical Evidence (compose /inquire)

Compose `/inquire` (Aitesis: `ContextInsufficient -> InformedExecution`) to observe inside the `BoundedTestSpace` and settle the scoped uncertainty (confirm, disconfirm, or find it inconclusive).

- Capture observation evidence in the bounded space — evidence over inference, with cited basis.
- Hold the scope-covers-claim discipline: the space actually exercised must cover the claim the evidence will license. Evidence drawn from a narrower slice than the claim it is asked to support is under-covering and does not yield a `ScopedResolution`.

The output is `EmpiricalEvidence` plus a `ScopedResolution` recording the outcome — confirming, disconfirming, or inconclusive — for the bounded space. Under-coverage (evidence drawn from a slice narrower than the claim) is the one case that yields no `ScopedResolution` for the full claim — its typed exit is a `CoverageShortfall`: re-scope the resolution to the slice actually covered (resolution over the slice + the uncovered remainder carried as `Residual`) or re-bound the space (→ Phase 2). A disconfirming result, by contrast, is a resolution, not its absence.

## Phase 4: Scope the Claim + Carry the Residual Forward

Restrict the resolution to the conditions actually tested, and route the complement onward.

- **Scope the claim**: state the resolution as an updated failure probability within the defined conditions — reduced where the evidence confirmed, raised where it disconfirmed, left open where it was inconclusive. An absolute assertion in either direction ("it behaves identically" / "it is broken") exceeds what any stand-in space can support and is set aside in favor of the scoped form.
- **Carry the residual forward**: route the `Residual` to a follow-up protocol — `/inquire` to gather more before a next decision, or `/elicit` to crystallize what the uncovered region still leaves open. The carry-forward is explicit output, recorded so a later session re-enters the uncovered region without re-deriving it.

At convergence, present the pairing: the scoped resolution with its defined conditions, and the carried residual with its routing. When the run ends in a `CoverageShortfall`, the pairing is the slice-scoped resolution (or an explicit no-resolution where no slice was covered) together with the uncovered claim-remainder as residual — the under-coverage path converges through the same pairing, never as a silent retry. The two together are the evidence that the test was honest about its reach.

## Rules

1. **Facet decomposition is the core act** (orchestration identity): The test's value is the explicit decomposition of the target↔surrogate equivalence into verifiable facets, not the construction of a stand-in space. A reduced space presented without its facet frame is an untested equivalence assumption wearing the appearance of evidence. The decomposed frame is surfaced for user recognition — with an Emergent probe for missing facets — before it constrains the boundary, so which facets count is never a silent AI determination.
2. **Constraint sync is Constitution** (authority boundary): The user defines the bounded space, and that definition constitutes the verifiable claim. The skill surfaces the facet frame and the boundary's includes/excludes; the user draws the cut.
3. **Scoped claim only** (evidence discipline): Resolution sentences assert an updated failure probability within the defined conditions — lower on confirmation, higher on disconfirmation, open on inconclusive. Absolute claims in either direction exceed what a stand-in space supports and are reframed to the scoped form. A disconfirming or inconclusive result is a first-class resolution, never suppressed to force a confirmation.
4. **Residual carries forward** (completeness): The uncovered complement is a first-class output routed to a follow-up protocol. A scoped resolution that omits its residual overclaims its reach.
5. **Scope covers claim** (coverage): The bounded test space must cover the claim it licenses. Evidence from a slice narrower than its claim is under-covering: it yields no scoped resolution for the full claim and exits as a `CoverageShortfall` — re-scope to the covered slice (resolution over the slice + remainder as residual) or re-bound — never an implicit retry.
6. **Compose, do not reinvent** (cost discipline): Reduced-Space Test orchestrates `/bound` and `/inquire` (with a conditional `/elicit` or `/induce` front). It introduces no new interaction deficit and adds no protocol-graph node.

## Boundary Note

`/reduced-space-test` sequences existing protocols and holds the scoping discipline across them. It reads the user's proposition and emits a scoped resolution plus a carried residual; it does not run the experiment substrate, provision environments, or enforce gate passage that belongs to a harness. Domain-specific facet templates (for data, software, or infrastructure stand-in spaces) are a deferred extension — the present contract is domain-free and decomposes facets per claim rather than from a fixed template.

## Anti-patterns

- **Absolute-claim leak**: asserting "it behaves identically" or "it is the same" from stand-in evidence. The claim must be scoped to the tested conditions; absolutes are not defensible from a reduced space.
- **Surrogate without difference inventory**: bounding a test space without naming where it diverges from the target. The unnamed differences are exactly where the scoped resolution silently fails.
- **Residual drop**: presenting the scoped resolution while discarding the complement. The uncovered region is the part most likely to surprise a later session.
- **Space-creation framing**: treating "build the reduced space" as the work and skipping the facet decomposition. The equivalence claim, left implicit, becomes an assumption rather than a tested facet.
- **New-protocol creep**: growing the utility into a standalone protocol with its own deficit and graph node. The composite is sufficient; a new mechanism would duplicate `/bound` and `/inquire`.
- **Constraint sync by relay**: drawing the reduced-space boundary on the user's behalf. The boundary constitutes the claim, so it is the user's to set.
- **Silent facet selection**: forming the facet frame and bounding the space without surfacing the frame for user recognition. Which facets count is the attention-shaping act; chosen silently, it injects the AI's bias into the very frame that licenses the claim.
- **Confirmation-only terminal**: treating the test as complete only when it confirms, with no honest terminal for a disconfirming or inconclusive result. A validation that cannot fail validates nothing; the disconfirming outcome is first-class.

## Operational checklist (per cycle)

- [ ] Phase 0 the `InferenceUncertainClaim` is stated; a `/elicit` or `/induce` front is used only when the intent is aporetic or the pattern is unnamed
- [ ] Phase 1 critical facets, surrogate↔target difference inventory, influence-path hypotheses, and a gap-measurement approach are surfaced as the `ScopedClaimFrame`, and the frame is surfaced for user recognition (with an Emergent missing-facet probe) before Phase 2 draws the boundary over it
- [ ] Phase 2 `/bound` defines the `BoundedTestSpace` with the user as a Constitution interaction and emits the `Residual`
- [ ] Phase 3 `/inquire` captures `EmpiricalEvidence` inside the bounded space under a scope-covers-claim discipline
- [ ] Phase 4 the resolution is scoped to the tested conditions (no absolute claim; a disconfirming/inconclusive outcome recorded as a first-class resolution, not retried into a confirmation) and the `Residual` is routed to a follow-up protocol
- [ ] Convergence pairs the scoped resolution with its defined conditions and the carried residual with its routing (or, on under-coverage, a `CoverageShortfall`: slice-scoped resolution + uncovered remainder as residual, or a re-bound)
