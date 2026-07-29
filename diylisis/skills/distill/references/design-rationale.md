# Design rationale — reception block and the locator predicates

Why the current shapes are what they are: what each replaced, what defect each closes, and which alternatives were evaluated and rejected.

You need this file when you are **editing or reviewing** the specification. An agent *executing* `/distill` does not — `SKILL.md` carries the whole execution contract on its own, and nothing here changes what the protocol does. Each section is anchored from the rule or block it explains.

---

## The locator predicates (Rule 21, Rule 26)

One name, `resolves_at`, used to carry three different claims at once: that a locator's **location class** is one a recipient can address, that its referent **exists and dereferences now**, and that it **will still resolve when the receiver arrives**. Bundling them is what made every repair round produce a new symptom of the same defect rather than a new defect.

The third claim is the one that cannot be discharged at all. An authoring session cannot verify, from inside itself, a property only the receiving session can observe: whether a substrate, a permission, a network, an account, or a referent still exists at some later moment. No author-side test establishes it — not a class judgment, not an emit act, not any combination. The specification already drew that line correctly once, in Rule 31, around content drift at a still-resolving locator; the contraction extends the same line around resolution itself.

So the claims separate by what is actually there to test:

- `recipient_class(locator, boundary)` — the **class screen**. Reads the root, never a referent, so it applies whether or not anything is there yet.
- `resolves_at(locator, boundary)` — class ∧ the referent **exists and dereferences now**, without author-session memory. Observation, and the whole of what certification establishes about an existing reference.
- `admissible_destination(locator, boundary)` — class ∧ the session can write there. The **prospective** test for a landing site: nothing exists to observe, so the class screen is the whole of it.
- `reference_ready(r, boundary)` — what use sites over existing references actually apply: observed to resolve, **or** beyond the evaluator's reach with an addressable class and identifying context, the second arm reported as unobserved.

The prospective/extant distinction is not one test read two ways. `resolves_at` on a not-yet-created landing site is simply false, so a single predicate covering both would have to mean different things at different sites. Under the unsplit reading the authoritative transition, and therefore every activity-bearing path, could not pass at all.

**Rejected: widen `resolves_at` to admit prospective referents.** Every site that reads an existing referent — the F2 StablePointer class, `self_contained`, `verified_operative`, `unresolvable_route_pointers`, and Rule 33's ledger pointer — would weaken with it. The defect lived at one site; widening would have paid for it at every other.

**Rejected: bridge the prospective test to the extant one.** A `bridge:` clause once derived consume-time resolution from the class screen plus F7's emit act. It is a modal fallacy: `admissible_destination` says the class *can host* a suitable referent, and the emit act says *a referent was created* — neither, nor their conjunction, says the created referent satisfies a future condition. What the emit act does establish is stated instead, and only that: a referent **exists at issuance**.

**Rejected: restore the withdrawn reference-observation architecture** (resolvability as a total result type, an authoritative-consumer mapping, provenance carriers — the direction under the `diylisis-f5-observation-withdrawn` tag). It was machinery for deriving a receiver-side fact from author-side evidence, and no amount of it crosses a temporal authority boundary. The one legitimate residue of that direction — distinguishing "observed resolvable now" from "not observable here, but class-admissible with identifying context" — costs a single predicate arm plus the `RouteJudgment.basis` and sweep-row fields that already exist.

## `StableRef` is a locator carrier, not a durability claim (TYPES)

`StableRef`'s declaration used to describe itself as "a reference resolvable without the author session" while the same line said durability is not a stored field. `SessionTethered(StableRef)` then put a deliberately non-portable locator inside that type, so the F0 default was not constructible on the type's own terms.

The name marks what the carrier is *for* — the references this protocol must keep dereferenceable — not a property its values are guaranteed to have. The addressability claim moved out to the use-site predicates above, and the constructor (`SessionTethered` / `Authoritative`) is what states the durability class.

**Rejected: introduce a new neutral locator carrier type.** That touches every use site, while the contradiction lived in one overclaiming clause whose own line already carried the correct account. The smaller edit was to delete the overclaim.

## Rule 31's scope — the activation-edge locator, not every pointer (Rule 31, F6)

The asymmetry sentence ("a pointer-class defect is surfaced rather than repaired into convergence here") read as covering all ROUTE pointers. It cannot: `unresolvable_route_pointers` is a measure leg in LOOP, and F6 repairs such a pointer by relocation under the same ROUTE disposition. The loop can still reach that locator while it runs, so leaving it dead would ship a defect the protocol could have closed.

What is genuinely surfaced rather than repaired is the **activation-edge** locator specifically — F5 does not judge it, the Phase 0 destination guard already settled it over a value nothing between F0 and F5 mutates, and re-measuring a settled gate's own verdict costs the bounded-loop guarantee for nothing.

**Rejected: revise F6 to match the broader claim.** F6's relocation repair is correct behaviour; the sentence overclaimed. Narrowing the sentence was the fix.

## Why the destination Stops rather than relays (Rule 26)

A `content_free` violation on the edge's verb repairs as relay because the repair is determined — there is one way to re-form the verb under the content-free discipline. The destination is not determined by the environment: several locations are writable, and the choice commits where the next action begins. So F0 presents the missing or unusable declaration and the **user** names it. The AI never selects it and never falls back silently to the scratchpad default.

## Why contract-provenance gets its own gate (Rule 29)

Direction and comprehension are different questions on different axes. Folding a contract-provenance finding into the Phase 3 residual gate's four options would leave the direction question unanswerable there — Resolve/Route/Drop/Defer are dispositions over an item, not over whether the contract claims more than the user's words established.

## Why the assurance tiers have no middle (Assurance Tiers)

Rule 9's F5 dispatch is unconditional: every certification pass runs the full gate under the strongest realization the platform offers, with no optional lighter layer. So there is no partial-rigor middle tier — a target either has never been through F7 (Draft) or carries a Certificate from a completed pass (Certified). Format density within the Certified tier still scales with residue volume, but that density is a presentation choice, not an assurance claim.

## Why the reception block's containment is a construction argument (Rule 34)

The block's boundary rests on how it is built — a fixed-template projection over components F6 already linted, authoring no prose of its own — rather than on a check that inspects a rendered block. That is a structural argument, not an enforced assurance, and Rule 34 states it as such. F5 runs before F7 renders and receives pre-render components, so no author-time gate inspects a rendered block and none is claimed to. A block already present within `target`, landed by a prior certification and now under re-certification, is `target` content like any other and audits under category 6 there.

## Why the checklist categories are a projection (Rule 9)

The refuter's categories are a projection of the portability principle (`portable(target, boundary)`, Rule 30) — regenerable from that principle when circumstances change, not a fixed normative enumeration the principle merely restates. This is why the Emergent category exists and why the set is not treated as closed. The runtime consequence — that a sweep finding nothing in the fixed categories is still not licensed to skip Emergent — stays in Rule 9, since an executing agent can get that one wrong.

## What these changes add to the protocol's machinery: nothing

Each argument below was made when the corresponding rule was introduced, to establish that it extends no coproduct and opens no new loop. They are addressed to a reviewer, not to an executing agent, which is why they live here.

**Rule 31's discriminator** removes a third unbounded-by-repair family from the fixed-point argument, alongside Rules 27 and 29. `J` is unchanged, there is no new contract instance, no new measure leg beyond the ones Rule 33 and the rule's own bookkeeping already name, and no new `Disposition` arm.

**Rule 34's reception block** adds no `emit_candidate` member, shifts no assembly from F7 to F6, and introduces no measure leg, no `Λ` field, no phase transition, and no field on the result type — `Certificate` is unchanged (Rule 30). Nor does it add a gate: its render condition lies inside Qp's existing firing set (`certificate_target = Authoritative(_)`), so Qp gains no fourth firing condition. Since F0 requires `activity ≠ Null → certificate_target = Authoritative(_)`, the render condition's second conjunct implies its first; both conjuncts are kept because they say different things — an activity-less pass with a named target lands a Certificate but has no reception act to hand over — not because the pair is redundant.

**Rule 32's firing set** contains the celebrated bare-`AlreadyPortable` scratchpad terminal strictly, not by equality. An activity-less pass may still name `Authoritative(_)` (F0's constraint runs one way only) and fires Qp on the second disjunct while remaining `activity = Null`. The shape Qp skips is therefore the activity-less pass that ALSO left its destination at the scratchpad default — the same pair of conditions Rule 34 keeps distinct.

## Vacant rule numbers (15, 19, 20, 23)

Four rule numbers are vacant. Rules 27 and 29 are cross-cited by number, and `../agents/zero-memory-refuter.md` numbers its checklist categories, so the numbers stay vacant rather than being reassigned or the remaining rules renumbered.

| Number | Formerly | Removed because |
|---|---|---|
| 15 | "Ledger consumption is read-only; re-distillation writes the ledger" — the CorrectionDelta ledger's read/append split | The ledger family it governed was deleted in the diylisis 1.0.0 refounding (reception-verification refounding, W1) |
| 19 | "Single canonical handoff (re-distillation discipline)" — the re-distillation write-side discipline | The re-distillation/ledger machinery was deleted in the same refounding. The surviving portability ground — a certification concerns ONE record, and a reception procedure directing the recipient to an uncertified sibling fails comprehension — now lives in Rule 9 and the CONVERGENCE §single certified record item |
| 20 | "Constituted horizon (re-verification, never suppression)" — `validity_horizon` transcription and expiry semantics on the CorrectionDelta ledger | The ledger and its horizon machinery were deleted in the same refounding |
| 23 | "Conditional correction ledger (handoff durability)" — the `HandoffDurability` classification that conditionalized the CorrectionDelta ledger | Both were deleted in the same refounding |
