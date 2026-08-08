# Dynamic Dimensional Elicitation over Fixed Taxonomy (issue #473)

> Design for the meta-pattern #473 wants to crystallize: replacing
> `{fixed dimension enum} ∪ Emergent` with a bounded loop in which the *dimensions
> themselves* surface emergently per mission. The issue asks two things — (1)
> establish the discriminator that decides which fixed enums should convert, and (2)
> develop the dual-direction (Periagoge ↔ Euporia) application. This doc settles
> both against a full suite survey.

## The pattern and its already-refined lesson

#473's seed is the `/frame` (Prothesis) `DeliberationTopology` change in #472: a
fixed-dimension enum was reframed into a per-mission emergent loop. The issue's own
**Update** records that this was *not* a clean win — `/frame`'s open-Map was later
found **UNSOUND** and bounded back to a finite-seed synthesis algebra (the seed axes
are fixed). So the refined pattern is not "dynamic beats fixed" but:

> An *open* dimension space, if unbounded, is unsound; the dynamic form is only valid
> when a bounding mechanism (finite-seed + composition algebra, user-agency, or
> external substrate) holds it closed. `/frame` is an **open→bounded hybrid**, not a
> pure-dynamic exemplar.

This reframes the whole investigation: the bar for converting a fixed enum to dynamic
is **high**, because most fixed enums are fixed precisely *to be* the bounding
mechanism the refined lesson demands.

## Suite survey — the discriminator applied

Every `{enum} ∪ Emergent` taxonomy and every relevant closed enum in the canonical
protocol SKILL.md files was classified against the issue's discriminator (finite &
stable → keep fixed; open & context-dependent dimension space → dynamic candidate).

| Protocol | taxonomy | Verdict | Why |
|---|---|---|---|
| Aitesis `/inquire` | `Dimension ∈ {Factual, Coherence, Relevance} ∪ Emergent` | **keep fixed** | The three epistemic verification modes of any claim are mission-invariant; mission changes *which* uncertainties fall into each, not the axes. |
| Aitesis `/inquire` | `EvidenceSource ∈ {UserTacit, Instrumentation, CodeDerivable, CanonicalExternal} ∪ Emergent` | **keep fixed** (closest to open) | Evidence *channels* with fixed cost-ordering; bucket-classification, not axis-elicitation. The channel space accretes, but `∪ Emergent` + base-promotion already supplies that openness. |
| Prosoche `/attend` | `SignalKind ∈ {ScopeConfinement, Budget, CompletionThreshold, Irreversibility} ∪ Emergent` | **keep fixed** | `project-profile-calibration.md` settles these as boundary signal kinds *knowable at protocol-definition time*, pre-committable. Settled direction. |
| Syneidesis `/gap` | `Gap ∈ {Procedural, Consideration, Assumption, Alternative} ∪ Emergent` | **keep fixed** | `derived-principles.md §Full Taxonomy Confirmation` names gap surfacing as the canonical detection-tool taxonomy — a stable internal scan set. |
| Katalepsis `/grasp` | 3 enums (ComprehensionIntent, GapType, BranchKind) | **keep fixed** (excluded) | Verification category — A5 + Differential Future Requirement + Full Taxonomy Confirmation §scope all exclude Katalepsis by design. |
| Diylisis `/distill` | `Origin ∈ {UserStatement, DocumentRead, ToolOutput, AIInference, PriorTask} ∪ Emergent` | **keep fixed** | Provenance categories are mission-invariant. |
| Elenchus `/sublate` | `Origin ∈ {…} ∪ Emergent`; `Pattern ∈ {ProvenanceAudit, CounterfactualGap, CrossSourceConsistency, InferenceFallacyAudit} ∪ Emergent` | **keep fixed** | Provenance categories + a closed family of elenctic challenge operations (a Socratic method-family). |
| Periagoge `/induce` | `UserMove ∈ {Confirm, Widen, Narrow, Fuse, Reorient, Dismiss}` (no Emergent) | **keep fixed** | Closed answer-type coproduct — see below. |
| Analogia `/ground` | `FitLabel ∈ {Preserved, Partial, Overextended}`; `V ∈ {Confirm, Adjust, Dismiss}` | **keep fixed** | Closed verdict scale + closed gate-answer coproduct. |

**Result: 0 of 13 surveyed core taxonomies are dynamic-elicitation candidates.** The
discriminator, applied honestly, places every canonical fixed-enum on the
finite-stable side. The OPEN class remains exactly the three already-known exemplars:
**Euporia `/elicit`** (`D[] = List(DimensionProjection)`, cycle-emergent, no fixed
taxonomy), **Horismos `/bound`** (per-cycle anchor dimension + EssenceTrend
default-residual), and **`/frame`** (open→bounded hybrid). This null result is itself
the issue's refined lesson in evidence: fixed taxonomies are fixed *because* they are
the bounding mechanism, and dualizing them would re-introduce the unsoundness `/frame`
had to retreat from.

### Periagoge UserMove — hypothesis confirmed

#473 hypothesized that Periagoge's `UserMove {Confirm/Widen/Narrow/Fuse/Reorient/
Dismiss}` is an intentional fixed Socratic family, **not** a dualize candidate.
Confirmed (high confidence): it is an *answer type* (`docs/structural-specs.md`
requires answer types to be **closed coproducts** — every case handled, distinct
processing path); it uniquely carries **no `∪ Emergent`** (openness comes from
always-available free response, not an enum escape); each move maps to a closed
Platonic dialectical algebra (Widen→Synagoge, Narrow→Diairesis, …); and `Fuse` is
already Dead-Signal-suppressed when no adjacent candidate exists. The set is the
protocol's owned method, not a mission-variant dimension space.

## The crisp discriminator (the issue's primary requested output)

> **Keep a `{enum} ∪ Emergent` fixed when the enum is a *classification taxonomy* — a
> protocol-owned, mission-invariant set of buckets that observed items are *sorted
> into*, each bucket routing to a fixed processing path (Full Taxonomy Confirmation /
> Dead Signal Test apply; `∪ Emergent` already absorbs novel members). Convert to
> dynamic dimensional elicitation only when the enum is a *dimension space* — the axes
> themselves, not merely which items populate them, materially differ per mission, so
> any pre-fixed axis list biases attention.**
>
> One-line operational form: **"Does the mission change WHICH items fall into the
> buckets (→ keep fixed) or WHAT the buckets/axes ARE (→ go dynamic)?"**

This refines *within* the existing `docs/structural-specs.md` "Classification types
(∪ Emergent)" convention rather than replacing it: the pattern targets the narrow
subset of classification types that are genuinely mission-variant *dimension spaces*
(only `/frame`'s `DeliberationTopology` qualified), graduating them past `∪ Emergent`
to a bounded reverse-trace / crystallization loop — while the mission-invariant
scanners (all 10 core Emergent taxonomies) stay fixed. Critically, the graduated form
must keep a bounding mechanism (the `/frame` lesson), so the move is **enum →
finite-seed bounded loop**, never **enum → open Map**.

## Dual direction (Periagoge ↔ Euporia)

The issue's second axis — which *direction* the dynamic form takes — resolves
cleanly given the null result. Because there are no new conversion targets, the dual
question is about how to **crystallize the discriminator itself**, and how the three
existing exemplars relate:

- **Bottom-up (Periagoge `/induce`)** — the three exemplars (`/elicit`, `/bound`,
  `/frame`-hybrid) are concrete instances converging on one unnamed essence
  ("finite-seeded important-first dynamic loop"). That convergence *is* a Periagoge
  colimit: instances → crystallized abstraction. The discriminator above is the
  crystallization output.
- **Top-down (Euporia `/elicit`)** — at *runtime*, `/frame`'s topology elicitation
  reverse-traces dimensions from the mission/substrate. That is the Euporia-patterned
  direction, and it is already how `/elicit` operates natively.

So the dual is not a per-protocol choice to be made now; it is a description of the
two faces the pattern already shows: **crystallize bottom-up (Periagoge), apply
top-down at runtime (Euporia).** No protocol needs a direction assigned because none
is being converted.

## Recommendation

1. **Crystallize the discriminator, do not dualize any protocol.** The durable output
   of #473 is the boundary test above — recorded so future protocol design checks
   "classification taxonomy vs dimension space" before adding a fixed enum. The
   honest finding is that the suite is *already correctly partitioned*: the 3 dynamic
   exemplars are dynamic, and the 10 classification taxonomies are correctly fixed.
2. **Where to inscribe it.** This is a structural authoring convention, so its home is
   `docs/structural-specs.md` (the "Type Category Convention" section that already
   distinguishes Closed coproducts from `∪ Emergent` classification types). Add the
   discriminator as a sub-distinction *within* the classification-type row. This is
   contributor-facing authoring guidance, not a runtime rule — it does not belong in
   any SKILL.md.
3. **Do NOT add meta-classification to the protocols themselves.** No SKILL.md edit,
   no new TYPES, no per-protocol "dimension space?" annotation. Adding that would be
   over-inscription with zero conversion payoff (mirrors the #454 caution).

## Open fork for the human

- **(A) Crystallize-only (recommended).** Inscribe the discriminator in
  `docs/structural-specs.md`; no protocol changes. Records the finding that the suite
  is already correctly partitioned.
- **(B) Crystallize + re-examine the one near-boundary case.** Same as (A), but also
  open a focused look at Aitesis `EvidenceSource` — the single taxonomy whose channel
  space genuinely accretes. The survey rates it finite-stable (its `∪ Emergent` +
  base-promotion already handles accretion), but it is the closest call. (B) is only
  worth it if the maintainer suspects `EvidenceSource` axes vary per mission rather
  than just accreting members — the survey's read is they accrete, so (A) is the
  default.

There is **no fork (C)** that converts a protocol — the survey found no sound target.

## Spec-edit sketch (fork A)

In `docs/structural-specs.md`, under the Type Category Convention's "Classification
types (`∪ Emergent`)" entry, add:

> **Classification taxonomy vs dimension space.** A classification type sorts observed
> items into a mission-invariant bucket set (each bucket → a fixed processing path);
> keep it fixed with `∪ Emergent`. A *dimension space* is one whose axes themselves —
> not merely their members — differ per mission; only such a space graduates to
> dynamic dimensional elicitation, and only as a **finite-seed bounded loop** (never
> an open Map — an unbounded dimension space is unsound; see `/frame`'s
> `DeliberationTopology` retreat). Test: *does the mission change WHICH items fall
> into the buckets (keep fixed) or WHAT the buckets are (go dynamic)?* As of the #473
> survey the only dimension-space protocols are `/elicit`, `/bound`, and `/frame`
> (hybrid); all other suite taxonomies are correctly fixed classification types.

No version bump (contributor doc). `static-checks.js` unaffected.
