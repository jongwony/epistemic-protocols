# Cognitive-Psychology Adoption Decisions (issues #478, #479, #480, #481, #484)

> Per-item adopt/decline for the five literature-derived protocol-enrichment proposals
> (#477 grounding cluster). Each issue states its proposal is *"a design implication — not
> an adopted spec"*; the deep-grounding docs (`docs/analysis/*-grounding.md`) supply the
> literature basis and the fidelity gaps. This doc is the **adoption decision** layer: per
> item, recommendation + the open fork for the human + a spec-edit sketch. The grounding is
> sound (verified in those docs); what is open is whether — and how far — each lands in the
> protocol, under this project's Extension-default + anti-over-inscription calibration.

## Premise verification (live HEAD — every issue re-checked, not trusted)

The cluster was filed against earlier protocol versions. Each target mechanism was re-checked
against the current SKILL.md before deciding:

| Issue | Target | Live state | Status |
|---|---|---|---|
| #478 | Aitesis `QuestionAct` typing / info-gain ranking | `aitesis 5.1.2` — no QuestionAct type; `branching_factor` already in TYPES | **live** (un-implemented; partial hook exists) |
| #484 | Aitesis answer-acceptance / grounding phase | `aitesis 5.1.2` — Phase 3 integrates, no acceptance step | **live** |
| #479 | Syneidesis PremortemPass / omission-risk / checklist | `syneidesis 2.22.4` — no premortem/omission; `committed(D)` action-centric (10×) | **live** |
| #480 | Analogia MappingLedger / higher-order / encoding | `analogia 1.7.4` — flat mappings, no systematicity | **live** |
| #481 | Prosoche elevated-risk gate → 2×2 SDT table | `prosoche 2.0.3` — **Risk Signal Taxonomy + runtime Classify removed**; compile-time only | **OBVIATED** |

**#481's premise was removed by the #422 `/attend` redefinition** (prosoche 2.0.0+). The runtime
risk Classify + Risk Signal Taxonomy the 2×2 would formalize no longer exist; `/attend` is now
compile-time-only (boundary inference → velocity partition → compile → emit goal entries), and
**fast-risk gating is declared out-of-scope (substrate handoff)**. Its grounding doc carries the
matching `[SUPERSEDED]` banner and records that the 2×2 was drop-decided in that redefinition.

## The adoption bar (this project's calibration)

These are enrichments to a working suite, not bug fixes. Four standing filters gate adoption:

1. **Dead Signal Test** (`derived-principles.md`) — every new taxonomy value must carry a *distinct
   downstream behavioral signal*; a value always resolvable to an existing one is dead weight.
2. **GateLoadBudget** (#482) — a new gate/step pays cumulative cognitive-load cost; a step that
   gates must justify against the chain it joins.
3. **Extension-default + anti-over-inscription** — the bar for new typed machinery is high; the
   model does much of this implicitly, so scaffolding must earn its surface.
4. **Epistemic Completeness Boundary** — runtime AI cannot supply calibrated quantities; any
   imported frame stays *prose-operational*, never implying numbers the runtime can't produce.

---

## #481 — Prosoche 2×2 signal-detection table → **DECLINE (obviated)**

**Proposal**: formalize every elevated-risk gate as a 2×2 (hit/miss/false-alarm/correct-reject)
requiring `base_rate`, `miss_cost`, `false_alarm_cost`, `criterion_reason`.

**Decision**: decline — the premise is structurally gone. The #422 redefinition removed the runtime
risk-gating machinery the 2×2 attaches to; `/attend` no longer classifies execution actions against
a risk taxonomy at runtime, and fast-risk interception is delegated to the substrate (non-epistemic,
per the Epistemic Completeness Boundary — the same boundary that settles #526). A 2×2 frame would
*re-introduce* runtime risk classification into `/attend`, reversing a shipped, deliberate direction.

The literature insight is not wasted: the grounding doc's core correction — *"fail-closed is a
criterion choice justified by asymmetric cost, not by 'risk exists'"* — already lives in the
redefined `/attend` as the velocity partition's rationale (slow/threshold risks compile; fast risks
hand off *because* their miss-cost lives in the substrate, not because they are uniformly dangerous).

**Open fork**: none — record #481 as superseded by #422, citing the grounding doc's banner.

**Spec-edit sketch**: no SKILL.md change. Close #481 with the supersession note; optionally add one
line to the Prosoche grounding doc's banner cross-linking the #526 substrate-boundary decision.

---

## #478 — Aitesis QuestionAct typing + info-gain ranking + bias shield → **PARTIAL adopt**

Three sub-parts with different verdicts; the issue bundles them but they separate cleanly.

**(b) Multi-axis info-gain ranking — ADOPT (strongest, lowest marginal cost).** Nelson (2005) shows a
single "uncertainty-narrowing" measure invites *information bias* — surfacing questions that move belief
but not the decision. Aitesis **already carries `branching_factor` in TYPES** (distinct resolution paths
× side-effect branches), so the refinement — rank by *expected info gain × branch impact ÷ user burden* —
**sharpens existing machinery** rather than adding a new axis. Marginal cost low, signal high. Keep it
prose-operational (no calibrated probabilities) per the Boundary.

**(a) QuestionAct typing — SCRUTINIZE (Dead Signal Test).** `clarify | confirm | request-evidence |
request-preference | request-authorization` is well-grounded (Searle illocutionary force). But Aitesis
*already* classifies uncertainties by `Verifiability` (ReadOnlyVerifiable / EmpiricallyObservable /
UserDependent) + `EvidenceSource` + `Dimension`. Several QuestionAct values overlap: `request-evidence`
≈ EmpiricallyObservable/ReadOnly resolution; `request-authorization` ≈ a Constitution gate. Apply the
Dead Signal Test: a QuestionAct value earns its place only if it routes *differently* from what the
existing classification already routes. `clarify` vs `confirm` (user-burden asymmetry) plausibly does;
the evidence/authorization values likely do not (they re-encode existing axes).

**(c) Bias shield — DEFER to emit-discipline, not a generation pass.** Generating anti-anchor /
anti-confirmation variants *per question* is a per-question generation cost the model largely already
discharges (it avoids leading phrasing without scaffolding). The defensible residue is a *prose rule*
("phrase at the least-leading form; do not anchor the user toward one resolution"), not a typed
variant-generation step.

**Recommendation**: adopt (b) now; adopt (a) only for the values that survive the Dead Signal Test
(likely `clarify`/`confirm` as a lightweight distinction, not a full 5-way coproduct); fold (c) into an
existing emit-discipline rule.

**Open fork**:
1. **QuestionAct home**: (i) TYPES coproduct (5-way) / (ii) prose distinction for the non-redundant
   values only (recommended) / (iii) fold entirely into the existing Verifiability+EvidenceSource axes.
2. **Ranking**: extend `branching_factor`'s use into an explicit ranking heuristic, or leave it implicit?

**Spec-edit sketch**: `aitesis/skills/inquire/SKILL.md` — Phase 2 prioritization prose: name the
*branch-impact* factor alongside info-gain (reuse `branching_factor`); add one emit-discipline line for
least-leading phrasing; if (a)(ii), add a 2-value `clarify`/`confirm` distinction where user-burden
differs. Patch bump; semantic-closure sweep on the ranking change; `static-checks.js` fail 0.

---

## #484 — Aitesis answer-acceptance / grounding phase → **adopt as relay, fork on placement**

**Proposal**: after a high-stakes answer, the AI reflects back its integration for the user to confirm
or correct before proceeding (Clark & Schaefer's acceptance phase).

**Decision**: adopt the *concept*, scoped to high-branch-impact answers — but **as a relay paraphrase-back,
not a new Constitution gate.** The grounding is real: Aitesis Phase 3 integrates an answer with no mutual
confirmation it landed as intended, so a high-stakes answer can be mis-integrated silently. The risk is
over-correction into double-gating, which the issue itself flags against #482. Resolution: the AI emits
its integration as **relay** ("I'm reading your answer as X → proceeding on that") — Recognition, not a
forced stop; the user corrects only if wrong. That captures the acceptance evidence (Clark's
"acknowledgment / display") without spending a gate from the GateLoadBudget.

**The boundary fork is genuine** and the issue names it: a *grounding* step touches Katalepsis (`/grasp`)
territory. But the direction differs — Katalepsis verifies the *user's* comprehension (user is the
measurement target); #484 verifies the *AI's* comprehension of the user's answer (dual direction). That
makes it Aitesis-native (a step in Aitesis's own integration), not a Katalepsis call — but the human
should confirm the boundary read.

**Open fork**:
1. **Placement**: (i) Aitesis Phase 3 relay paraphrase-back, high-stakes only (recommended) / (ii) a
   shared cross-protocol "acceptance" move / (iii) route to Katalepsis (rejected — wrong measurement
   direction).
2. **Trigger**: gate the paraphrase-back to high-branch-impact answers (reuse `branching_factor`), so it
   is cost-aware and does not ground every trivial reply.

**Spec-edit sketch**: `aitesis/skills/inquire/SKILL.md` — Phase 3 `integrate`: when
`branching_factor(answer)` is high, emit an integration-readback as relay (Extension, not a Qs gate)
before proceeding; a correction re-enters Phase 1. TYPES: optional `integration_readback` as a relay
emit, not a new gate. Patch bump; semantic-closure sweep (the readback is relay → no new convergence
condition); `static-checks.js` fail 0.

---

## #479 — Syneidesis PremortemPass + omission-risk + checklist → **adopt core (with the sharp sub-finding)**

**Proposal**: a `PremortemPass` (failure-simulation generation) before the gap taxonomy; `omission-risk`
as a gap type; a 5–9 item stage-bound checklist.

**Decision**: adopt the PremortemPass + the **active-condition correction** (the load-bearing part);
scope the checklist narrowly.

**PremortemPass — ADOPT, with the tense boundary.** Syneidesis is detection-only (`Scan(D)`); it has no
*generation* move that manufactures failure modes. Premortem (Klein, from Mitchell/Russo/Pennington 1989)
supplies exactly that. Critical boundary the grounding nails: the active ingredient is the *certainty/tense*
shift — frame as **completed** ("assume this decision failed; why?"), not subjunctive ("might fail"). A
subjunctive premortem loses the effect.

**omission-risk — the issue's own sharpening is the real finding.** Adding `omission-risk` as a gap type is
*necessary but not sufficient*: the active predicate `committed(D)` is action-centric (verified — `committed`
appears 10× around state-change / external-visibility / resource-consumption), so "not doing X" is excluded
**at the active stage** (the SKILL.md self-declares the direction-commitment omission). A taxonomy type added
downstream of an active filter that already excluded inaction is a dead branch. **The fix corrects the active
condition** to admit inaction risk — a deeper change than a taxonomy add, and the one that carries the signal.

**Checklist — SCOPE narrowly or defer.** Pronovost/Haynes evidence is medical/aviation, where failure modes
are *enumerable and recurring*. A general expanding checklist fights Syneidesis Rule 2 (no gap inflation).
Adopt only as a *stage-bound, enumerable-failure-mode* aid, or defer — not an open ontology.

**Recommendation**: adopt PremortemPass (completed-tense) + the `committed(D)` active-condition correction;
treat the checklist as a narrow follow-on, not part of the core change.

**Open fork**:
1. **PremortemPass placement**: (i) a Phase step before Scan / (ii) an Intensity-gated move (only above a
   stakes threshold, cost-aware). Lean (ii) to respect GateLoadBudget.
2. **`committed(D)` correction shape**: how to admit inaction risk without breaking the gap-partition
   invariant (the issue flags the partition check) — widen the predicate, or add a parallel
   `omission(D)` active arm feeding the same taxonomy.

**Spec-edit sketch**: `syneidesis/skills/gap/SKILL.md` — add the PremortemPass as an Intensity-gated
generation move feeding `Scan`; correct the active predicate (`committed(D)` → admit inaction risk) and
re-verify the partition invariant in the semantic-closure sweep; `omission-risk` enters the taxonomy
*only after* the active arm can reach it. Patch bump; `static-checks.js` fail 0; run the syneidesis tests.

---

## #480 — Analogia MappingLedger + higher-order + analogical-encoding → **adopt ledger; scope encoding**

**Proposal**: replace generic "does this map?" with a `MappingLedger` (base/target objects, first-order
relations, higher-order causal relations, unmapped residues, forbidden inferences); add an
analogical-encoding move (compare two concrete cases before applying); require higher-order alignment.

**Decision**: adopt the MappingLedger + higher-order/systematicity weighting (the central SMT gap); scope
or defer analogical-encoding on the Periagoge boundary.

**MappingLedger + higher-order — ADOPT.** Gentner's *central* predictor is systematicity — higher-order
causal relations preferentially map. Analogia treats correspondences as a **flat set** (`mappings = confirmed
∪ dismissed ∪ remaining`) and selects by info-gain, with no first-order/higher-order distinction. The ledger
structure + a systematicity weighting in Phase 2 selection (prefer correspondences in a connected causal
system) closes exactly that gap, and the `overextended` field already gestures at "forbidden inferences" —
the ledger generalizes it. Strong grounding, native fit.

**analogical-encoding — SCOPE or DEFER (boundary risk).** Strongest effect size in the literature (48% vs
19%, Gentner/Loewenstein/Thompson 2003), but two-case comparison → abstracted relation is abstraction
*formation*, which is Periagoge (`/induce`) territory — the grounding doc explicitly warns the move "blurs
the protocol boundary" and must stay a *verification aid*. Adopting it wholesale would pull formation into a
validation protocol. Lean: defer, or admit only as a bounded verification-aid (compare the user's case to
one concrete exemplar to *test* a mapping, not to *form* a new abstraction).

**Recommendation**: adopt MappingLedger + higher-order weighting; defer analogical-encoding pending the
boundary call (or admit it narrowly as verification-aid only).

**Open fork**:
1. **Ledger representation**: (i) prose checklist (lighter, Extension-friendly) / (ii) structured emit
   (a `MappingLedger` TYPES entry). Lean (i) unless the structure earns a typed emit.
2. **analogical-encoding placement**: (i) defer / (ii) narrow verification-aid in Analogia / (iii) route to
   Periagoge as the formation owner. This is the genuine boundary decision.

**Spec-edit sketch**: `analogia/skills/ground/SKILL.md` — extend the fit map with a first-order/higher-order
relation distinction; add a systematicity factor to Phase 2 selection (currently info-gain only); generalize
`overextended` into explicit forbidden-inference (+ optional licensed-inference) output. Hold
analogical-encoding for the boundary fork. Patch bump; semantic-closure sweep on the selection-criterion
change; `static-checks.js` fail 0.

---

## Cross-cutting

**Add-then-consolidate tension with #434.** Three live adoptions (#478, #479, #480) add typed machinery to
protocols that #434 (this backlog's rules-consolidation decision) just scoped for *reduction* — Syneidesis
and Analogia are consolidation candidates; Aitesis is a consolidated precedent. These are not in conflict if
the enrichments land as **Phase/TYPES machinery with minimal new Rules**: the Dead Signal Test and #434's
"keep the Rules spine minimal" point the same way. New behavior belongs in Phase prose and TYPES, not as new
`## Rules` entries — adopt accordingly.

**#481-obviated as a directional signal.** The `/attend` redefinition removed runtime machinery in favor of
compile-time + substrate delegation. #481's 2×2 would have re-added runtime risk classification — against
that direction. The cluster's strongest *grounded* proposal was also the one the project's own evolution had
already ruled out; verifying premises against live HEAD, not the issue text, is what caught it.

**Adoption order (if accepted)**: #478(b) and #480 ledger first (strong grounding, low overlap, native fit);
#479's `committed(D)` correction next (deepest — active-condition change, partition-invariant risk); #484 last
(needs the boundary + load resolution); #481 closed as superseded.

## Open fork for the human (summary)

1. **Per-item disposition**: #481 **decline/close (obviated)**; #478 **partial — adopt (b), scrutinize (a),
   fold (c)**; #484 **adopt as relay readback, high-stakes only**; #479 **adopt PremortemPass + committed(D)
   correction, scope checklist**; #480 **adopt ledger + higher-order, scope analogical-encoding** —
   accept this disposition set, or re-weight any item?
2. **The three live boundary forks** carry the real judgment: #478 QuestionAct home (coproduct vs prose vs
   fold), #479 `committed(D)` correction shape (partition invariant), #480 analogical-encoding placement
   (Analogia verification-aid vs Periagoge formation).
3. **Landing form**: confirm the cross-cutting rule — enrichments land as Phase/TYPES machinery with minimal
   new `## Rules`, consistent with #434.

## Spec-edit sketch (cluster-level)

Per-protocol patch bumps + `static-checks.js` fail 0 + the protocol's own tests, each with the
semantic-closure sweep (a new condition/type needs its type, guard, state update, termination path, result).
No cross-protocol coupling except the shared `branching_factor` reuse in #478/#484 (both Aitesis). #481 is
docs-only (close + supersession note). This doc is the decision record; each adopted item becomes its own
implementation PR.
