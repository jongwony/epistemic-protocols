# Rules Consolidation Re-baseline (issue #434)

Drift-aware tracker for `## Rules` consolidation across the remaining candidate
protocols. **Replaces issue #372** (mid+low-priority continuation), whose count
targets are stale. This tracker re-baselines against the **current** repository
state — counts and classifications are measured from the live SKILL.md files, not
inferred from #372 or from #434's own creation-time snapshot.

- **Framework**: `.claude/principles/safeguards.md` → `Rule Classification Framework`
  (6 tiers, variation-stable across the 88-rule high-priority application: PRs
  #368/#369/#370/#371).
- **Anchors**: `.claude/rules/axioms.md` (A1–A6), `.claude/rules/derived-principles.md`,
  `.claude/principles/architectural-principles.md`.
- **Already consolidated** (precedent, not in scope): Aitesis, Prosoche, Anamnesis,
  Horismos.
- **Verification per PR**: `node .claude/skills/verify/scripts/static-checks.js .`
  (fail 0); `node --test scripts/package.test.js` when packaging/runtime-contract
  views are touched.

> This is a contributor governance doc, not a runtime-contract surface. It may
> reference `.claude/**` source paths freely; the Plugin Encapsulation source-leak
> prohibition binds SKILL.md only.

## The six tiers (recap)

| Tier | Source | Action |
|---|---|---|
| 1. Axiom anchor | A1–A6 (`axioms.md`) | KEEP, 1–2 line restatement, axiom name inline (no `(Aₙ)` label) |
| 2. Derived anchor | Derived principles (`derived-principles.md`) | KEEP, anchor reference by principle name |
| 3. Architectural project-specific | Architectural principle / protocol Core Principle | KEEP invariant 1-liner; migrate paragraph **body** to Phase prose or UX Safeguards |
| 4. Cross-protocol | Distinction from another protocol | Move to "Distinction from Other Protocols" section |
| 5. Safeguard tier | `safeguards.md` / Trajectory-Candidates match | Mark Safeguard tier + inline the Actionable revision criterion |
| 6. Edge/Audit | Project UX, non-invariant | Move to UX Safeguards table or end-of-Rules cluster |

The consolidation payoff is **not** in Tiers 1/2/5 (already-minimal anchors that
recur as a common spine, below) — it is concentrated in **Tier 3** (collapse the
paragraph body into Phase prose, leave the invariant 1-liner) and **Tier 4** (move a
cross-protocol routing rule into a Distinction section). A protocol's candidacy is
read off how much Tier-3/Tier-4 body it carries.

## Count re-baseline (current HEAD)

Measured at `origin/main @61e1b32`. "Total" counts every entry including sub-letter
rules (`6a`, `9b`, …); "Top-level" counts only integer-numbered rules. Both the #372
targets and #434's creation-time snapshot are listed to show the drift — **neither is
the target**; current state is the source of truth.

| Protocol | SKILL.md | #372 target | #434 snapshot | **Current total** | Top-level | Sub-letter |
|---|---|---:|---:|---:|---:|---|
| Periagoge | `periagoge/skills/induce/SKILL.md` | 17 | 21 | **18** | 16 | 6a, 10a |
| Epharmoge | `epharmoge/skills/contextualize/SKILL.md` | 17 | 22 | **18** | 18 | — |
| Analogia | `analogia/skills/ground/SKILL.md` | 17 | 16 | **18** | 17 | 16a |
| Prothesis | `prothesis/skills/frame/SKILL.md` | 14 | 16 | **15** | 15 | — |
| Syneidesis | `syneidesis/skills/gap/SKILL.md` | 12 | 11 | **13** | 13 | — |
| Katalepsis | `katalepsis/skills/grasp/SKILL.md` | 11 | 16 | **19** | 15 | 7a, 9a, 9b, 14a |
| Elenchus | `elenchus/skills/sublate/SKILL.md` | — | 14 | **18** | 18 | — |

Current totals diverge from **both** prior snapshots for every protocol — the #434
premise (counts drift through unrelated work; mechanical count targets mislead) is
confirmed. Prothesis additionally already carries separate `## Adversarial Guards`
and `## Known Limitations` sections (a partial Tier-3 migration surface that already
exists).

## Common spine (recurs across all 7 — anchors, not consolidation targets)

These rules appear near-verbatim in every candidate (and in the consolidated
precedents). They are already minimal — KEEP as-is; they are **not** where reduction
comes from.

| Spine rule | Tier | Anchor |
|---|---|---|
| `AI-guided, user-{resolved/judged/validated}` (first rule) | 1 | A2 Detection with Authority |
| `Recognition over Recall` | 1 | A1 |
| `Convergence persistence` | 1 | A3 |
| `Context-Question Separation` | 1 | A6 |
| `Convergence evidence` | 2 | Convergence Evidence (A3) |
| `Option-set relay test` | 2 | A5 + Differential Future Requirement |
| `Zero-{gap/mismatch/result} surfacing` | 2 | Surfacing over Deciding / Full Taxonomy |
| `Gate integrity` | 5 | Safeguard (Gate Integrity operational guards) |
| `Plain emit discipline` | 3 | Architectural (emit layer) |
| `Round-local salience bundling` | 3 | Architectural (cognitive-load / emit layer) |
| `Formal blocks are runtime-normative` | 3 | Architectural (formal-block runtime contract) |

**Katalepsis exception**: correctly carries **no** `Option-set relay test` rule —
verification-category, 1-correct option sets are excluded from A5 / Differential
Future Requirement by design. Preserve this absence.

**Tier-5 annotation drift (action item)**: the `Gate integrity` rule carries the
explicit `(Safeguard tier)` annotation in Periagoge, Epharmoge, Syneidesis, Elenchus
(and the consolidated Aitesis) — but the annotation is **missing** in Analogia (13),
Prothesis (12), Katalepsis (11). None of the seven candidates inline the Actionable
revision criterion on `Gate integrity` (`safeguards.md` lists only Aitesis / Prosoche
/ Horismos full-form, Anamnesis abbreviated). Normalizing the annotation + inlining
the criterion is a uniform Tier-5 action for each PR.

## Track A — per-protocol classification

Each table classifies the current rules by tier. `→ migrate` flags a Tier-3 rule whose
paragraph body is the reduction target; `→ Distinction` flags a Tier-4 cross-protocol
rule. Spine rules are abbreviated.

### Periagoge (`/induce`) — 18 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | AI-guided, user-triangulated | 1 (A2) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Calibration + candidate + grounding required | 3 (Core Principle) |
| 4 | Calibrative Induction via Dialectical Triangulation | 3 (Core Principle) |
| 5 | Socratic move preservation | 3 (Synagoge/Diairesis/Fuse/Reorient) |
| 6 | Free response honored | 3 |
| 6a | Fuse dead-signal suppression | 2 (Dead Signal Test) |
| 7 | Convergence persistence | 1 (A3) |
| 8 | Cross-protocol awareness (defer to Analogia) | **4 → Distinction** |
| 9 | Context-Question Separation | 1 (A6) |
| 10 | Convergence evidence | 2 |
| 10a | Open residual disposition (`OpenTrace`) | 3 → migrate |
| 11 | Absorb Analogia misfit (colimit-shaped routing) | **4 → Distinction** (heavy body) |
| 12 | Option-set relay test | 2 |
| 13 | Gate integrity (Safeguard tier) | 5 |
| 14 | Plain emit discipline | 3 (spine) |
| 15 | Round-local salience bundling | 3 (spine) |
| 16 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 4 · Derived 3 · Architectural 8 · Cross-protocol 2 · Safeguard 1 · Edge 0**.
Reduction surface: rules 3/4/5/10a (architectural bodies) + 8/11 (cross-protocol →
Distinction section). Rule 11 carries the heaviest cross-protocol body.

### Epharmoge (`/contextualize`) — 18 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | AI-guided, user-judged | 1 (A2) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Applicability over Correctness | 3 (Core Principle) |
| 4 | Evidence-grounded | 2 (Surfacing over Deciding) |
| 5 | Convergence persistence | 1 (A3) |
| 6 | Non-circularity (independence from Aitesis) | **4 → Distinction** |
| 7 | Context-Question Separation | 1 (A6) |
| 8 | Convergence evidence | 2 |
| 9 | Zero-mismatch surfacing | 2 |
| 10 | Option-set relay test | 2 |
| 11 | Gate integrity (Safeguard tier) | 5 |
| 12 | Significant requires demonstrable behavioral impact | 3 (severity discipline) |
| 13 | Plain emit discipline | 3 (spine) |
| 14 | Round-local salience bundling | 3 (spine) |
| 15 | Applicability fit map is support only | 3 → migrate |
| 16 | All certificate-passing mismatches remain tracked | 3 → migrate (body) |
| 17 | Registration-time deficit-fit certificate, dual-axis revalidation | 3 → migrate (**largest body**; cross-protocol routing to `/gap`,`/inquire`,`/bound`,`/distill`) |
| 18 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 4 · Derived 4 · Architectural 8 · Cross-protocol 1 · Safeguard 1 · Edge 0**.
Reduction surface: rules 16 and **17** are the single heaviest paragraph bodies in the
candidate set (17 is a multi-hundred-word meta-backbone certificate spec with embedded
cross-protocol routing). Highest body-migration payoff of all seven.

### Analogia (`/ground`) — 18 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | AI-guided, user-validated | 1 (A2) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Domain decomposition first | 3 (Phase 1) |
| 4 | Structural Correspondence over Abstract Assertion | 3 (Core Principle) |
| 5 | Concrete instantiation required | 3 (Core Principle) |
| 6 | Evidence-grounded | 2 (Surfacing) |
| 7 | Validation respected | 3 |
| 8 | Convergence persistence | 1 (A3) |
| 9 | Context-Question Separation | 1 (A6) |
| 10 | Convergence evidence | 2 |
| 11 | Zero-gap surfacing | 2 |
| 12 | Option-set relay test | 2 |
| 13 | Gate integrity | 5 *(missing `(Safeguard tier)` annotation)* |
| 14 | Plain emit discipline | 3 (spine) |
| 15 | Round-local salience bundling | 3 (spine) |
| 16 | Protocol-native pressure map (`CorrespondenceFitMap`) | 3 → migrate |
| 16a | Self-grounding / split-vs-trim partition reading | **4 → Distinction** (heavy body; routes to `/conduct`, `/induce`) |
| 17 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 4 · Derived 4 · Architectural 8 · Cross-protocol 1 · Safeguard 1 · Edge 0**.
Reduction surface: rule 16a is a large cross-protocol body (the "fit-map work" #434
flags) → Distinction section; rule 16 fit-map body → Phase prose.

### Prothesis (`/frame`) — 15 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | Mission Brief confirmation | 3 (Phase 0→1; TOOL GROUNDING body) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Lens-formation tool, not arranger/executor (core invariant) | 3 → migrate (heavy; Epistemic Completeness Boundary) |
| 4 | Substrate-invariance | 3 → migrate (heavy) |
| 5 | No inline synthesis (core invariant) | 3 → migrate (heavy) |
| 6 | Independence-before-contamination (routed to `/conduct`) | 3 → migrate (heavy; cross-protocol body) |
| 7 | Verbatim transmission | 3 |
| 8 | Context-Question Separation | 1 (A6) |
| 9 | Convergence evidence | 2 |
| 10 | Zero-result surfacing | 2 |
| 11 | Option-set relay test | 2 |
| 12 | Gate integrity | 5 *(missing `(Safeguard tier)` annotation)* |
| 13 | Plain emit discipline | 3 (spine) |
| 14 | Round-local salience bundling | 3 (spine) |
| 15 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 2 · Derived 3 · Architectural 9 · Cross-protocol 0 · Safeguard 1 · Edge 0**.
Reduction surface present (rules 3/4/5/6 are heavy core-invariant bodies that partly
duplicate the existing `## Adversarial Guards` / `## Known Limitations` sections) — but
these are **load-bearing invariants** the protocol exists to enforce (`false-convergence`,
`arranger-creep`, `executor-creep` guards). #434 caution holds: avoid broad churn;
migrate only into the existing guard sections, preserving every invariant 1-liner.

### Syneidesis (`/gap`) — 13 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | AI-guided, user-judged (Detection with Authority) | 1 (A2) |
| 2 | Observable evidence regulation | 2 (Surfacing) |
| 3 | Minimal intrusion (Surfacing over Deciding) | 2 |
| 4 | Gap dependencies | 3 |
| 5 | Context-Question Separation | 1 (A6) |
| 6 | Convergence evidence | 2 |
| 7 | Zero-gap surfacing | 2 |
| 8 | Option-set relay test | 2 |
| 9 | Gate integrity (Safeguard tier) | 5 |
| 10 | Plain emit discipline | 3 (spine) |
| 11 | Round-local salience bundling | 3 (spine) |
| 12 | Protocol-native pressure map (`GapPressureMap`) | 3 → migrate |
| 13 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 2 · Derived 5 · Architectural 5 · Cross-protocol 0 · Safeguard 1 · Edge 0**.
Already lean (5 derived anchors, no cross-protocol rules, one migratable body at rule
12). Lowest reduction payoff — opportunistic only, matching #434.

### Katalepsis (`/grasp`) — 19 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | User-initiated only | 3 (activation) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Intent scent before artifact taxonomy | 3 (intent-scented entry points) |
| 4 | Task tracking | **6 (Edge/Audit)** |
| 5 | Code grounding | **6 (Edge/Audit)** |
| 6 | User authority | 1 (A2) |
| 7 | Proposal ejection | 3 → migrate (body) |
| 7a | Continuation cursor after side branches | 3 → migrate (body) |
| 8 | Context-Question Separation | 1 (A6) |
| 9 | Convergence evidence | 2 |
| 9a | Post-answer closure | 3 |
| 9b | Active-turn fail-closed | 3 (**load-bearing — preserve**) |
| 10 | Zero-gap surfacing | 2 |
| 11 | Gate integrity | 5 *(missing `(Safeguard tier)` annotation)* |
| 12 | Plain emit discipline | 3 (spine) |
| 13 | Round-local salience bundling | 3 (spine) |
| 14 | Protocol-native route map (`ComprehensionRouteMap`) | 3 → migrate (body) |
| 14a | Horizon boundary (Katalepsis/Prothesis) | **4 → Distinction** (heavy body) |
| 15 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 3 · Derived 2 · Architectural 10 · Cross-protocol 1 · Safeguard 1 · Edge 2**.
Highest current count. Reduction surface exists (rules 7/7a/14 bodies → Phase prose;
14a → Distinction; 4/5 → UX Safeguards/Edge cluster) **but** verification-category
caution: rule 9b (active-turn fail-closed) is load-bearing recent behavior — preserve
exactly; no `Option-set relay test` to add (A5 exclusion by design).

### Elenchus (`/sublate`) — 18 rules

| Rule | Name | Tier |
|---|---|---|
| 1 | User-initiated only | 3 (Layer 2 activation) |
| 2 | Recognition over Recall | 1 (A1) |
| 3 | Context-Question Separation | 1 (A6) |
| 4 | Detection with authority | 1 (A2) |
| 5 | Surfacing over Deciding | 2 |
| 6 | Convergence evidence | 2 |
| 7 | Source chain preservation | 3 |
| 8 | Loop continuity under bounded regret | 2 (Loop Continuity) |
| 9 | Antithesis must be dialectical (Patterns A–D) | 3 → migrate (body; routes procedural queries to `/inquire`,`/attend`) |
| 10 | Closed coproduct discipline | 3 |
| 11 | Gate integrity (Safeguard tier) | 5 |
| 12 | Substrate boundary | 3 (Epistemic Completeness Boundary) |
| 13 | Plain emit discipline | 3 (spine) |
| 14 | Round-local salience bundling | 3 (spine) |
| 15 | Claim-relative provenance (`ProvenanceTag`) | 3 → migrate (body) |
| 16 | Currency is not support-integrity | 2 (named Derived principle) → anchor-reference |
| 17 | Inference-fallacy archetypes are principle, not closed catalog | 3 → migrate (body; Full Taxonomy / Emergent) |
| 18 | Formal blocks are runtime-normative | 3 (spine) |

Tally — **Axiom 3 · Derived 4 · Architectural 10 · Cross-protocol 0 · Safeguard 1 · Edge 0**.
Reduction surface: rules 9/15/17 are heavy antithesis-pattern bodies → Phase prose;
rule 16 already restates a named Derived principle (`Currency is not Support-Integrity`)
and can collapse to an anchor reference. Behavior-sensitive: do not alter `/sublate`'s
antithesis Patterns A–D semantics — migrate bodies only, keep invariant 1-liners.

## Track B — candidate selection (re-derived from current classification)

Priority is read off Tier-3 body weight + Tier-4 cross-protocol count, discounted by
behavior-preservation risk. This re-derives #434's Suggested Tracks against the
current state.

| Rank | Protocol | Reduction surface | Risk | Disposition |
|---|---|---|---|---|
| 1 | **Epharmoge** | Rules 16,17 = heaviest bodies (meta-backbone certificate) | Low | Strongest payoff — lead PR |
| 2 | **Periagoge** | 4 architectural bodies + 2 cross-protocol (8,11) | Low-Med | Strong; clean Distinction extraction |
| 3 | **Analogia** | Rule 16a cross-protocol body + fit-map (16) | Med | Good; fit-map work in flight per #434 |
| 4 | **Elenchus** | Antithesis-pattern bodies (9,15,17); rule 16 → anchor | Med | Include — framework applies without changing `/sublate`; migrate bodies only |
| 5 | **Katalepsis** | Highest count; bodies 7,7a,14 + 14a Distinction; 4,5 → Edge | **High** | Verification-category; preserve 9b fail-closed, A5 exclusion |
| 6 | **Prothesis** | Heavy core-invariant bodies (3–6) | **High** | Opportunistic; migrate only into existing guard sections, no broad churn |
| 7 | **Syneidesis** | Already lean; one body (12) | Low | Opportunistic — minimal payoff |

## Track C — per-protocol PR template

One protocol per PR (unless two are mechanically identical). Each PR includes:

- before/after rule count (current total from the table above is the "before");
- the Track-A classification table for the protocol;
- explicit statement that **endpoint and morphism semantics are unchanged**;
- Tier-5 normalization: add `(Safeguard tier)` where missing (Analogia 13, Prothesis
  12, Katalepsis 11) and inline the Actionable revision criterion on `Gate integrity`;
- plugin version bump (patch) — **only** when the PR edits SKILL.md (this tracker doc
  alone needs none);
- verification output: `node .claude/skills/verify/scripts/static-checks.js .`
  (fail 0); `node --test scripts/package.test.js` when runtime-contract views shift.

Acceptance (per #434): current-state classification replaces stale #372 targets; each
protocol preserves endpoint + runtime contract; no rule removed merely for duplicating
contributor docs (runtime self-containment wins); Safeguard-tier rules retain the
actionable revision criterion where still needed.

## Status

| Protocol | Re-baselined | PR | State |
|---|---|---|---|
| Periagoge | ✓ | — | not started |
| Epharmoge | ✓ | — | not started |
| Analogia | ✓ | — | not started |
| Prothesis | ✓ | — | not started |
| Syneidesis | ✓ | — | not started |
| Katalepsis | ✓ | — | not started |
| Elenchus | ✓ | — | not started |

## Out of scope (per #434)

- #373-style empirical violation-rate measurement (tracker deprecated).
- Re-opening the #367–#371 merge narrative; current repo state is the source of truth.
- Broad protocol behavior redesign.
