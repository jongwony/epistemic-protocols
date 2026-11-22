# /preview — Proplasma (πρόπλασμα)
<a name="proplasma--preview-πρόπλασμα"></a>

> [한국어](./README_ko.md)

Use `/preview` right before you commit to a direction, when two or more candidate options are on the table but you cannot judge how they differ from descriptions alone — when you find yourself deferring to a general principle, reworking the options instead of choosing, or thinking "I'd have to see it."

<a name="usage"></a>
Type:

```
/preview [the direction decision you are about to commit to]
```

Before building anything, the AI checks that your choice has two or more candidates whose differences a placeholder preview can show (if not, it tells you why and what would settle the decision instead). It then states its reading of your purpose and what will differ between the examples and which details will be stand-ins (the axes where the candidates diverge for your purpose and the placeholder policy), each with its basis. Next, it builds cheap, isolated placeholder probes — text vignettes or temporary mockups that take different values on those axes — and shows them alongside a direction map.

In the map, every cell shows what a direction's future looks like on an axis and what that rests on: a probe you saw, a description alone, your own account, or real evidence from a source or observation. What you expected is laid beside what the probes show so you can see where they agree and where they part. In your own words, with no numbered menu required, you can:
- Ask about an existing preview, or ask to see a revised spec, a combination of probes, or a candidate that was left out (the AI relays the spec again and builds new probes).
- Ask to check something real without changing it (the result enters the map as evidence, never as a probe).
- Stop at any time, leaving the run and its probes as they stand until you decide.
- Settle on a probe-shown direction, a combination, or even a direction no probe showed (marked as never materialized).

Once you settle a direction, the AI removes the temporary previews. The AI reports which previews it removed and what still needs cleaning up. You keep the direction decision, the map cells that decided it, and the open unknowns with what would settle each.

<a name="what-is-proplasma"></a>
<a name="the-core-problem"></a>
<a name="the-solution"></a>
<a name="difference-from-other-protocols"></a>
<a name="three-breach-conditions"></a>
<details>
<summary>How probes work, how this compares to other protocols, and safety guards</summary>

### Name, Problem, and Solution

**Proplasma** reinterprets Greek πρόπλασμα (the preliminary clay model a sculptor shapes before committing to marble). When a direction choice is unrecognizable from words (`DirectionUnrecognizable`), well-formed options still leave you mentally simulating consequences instead of recognizing them.

**Contrast over Simulation** and **Grounded, not asserted**: the AI drafts the divergence axes your purpose turns on (marking its reading of your purpose as its own until you state it) and the placeholder policy, relays them with their basis before generating anything, and materializes probes that commit different values on those axes. If the AI finds the contrast insufficient, it says so with its basis and either builds a revision (relaying the spec again) or proposes one; if it reads that the futures are already recognizable, it says so and proposes closing; only you close the run. Probes are overtly synthetic, never evidence for any claim, and discarded after harvest with each probe's disposition declared (any failed destruction is declared with a cleanup handoff, never silent).

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Horismos | AI-guided | `BoundaryUndefined → DefinedBoundary` |
| **Proplasma** | **Hybrid** | **`DirectionUnrecognizable → DirectionalContrast`** |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**The trichotomy**: understanding lacking → `/grasp` (verify that I understood); boundary lacking → `/bound` (settle how far); **future unrecognizable → `/preview` (see the directions, then judge)**.

**When it does not activate**: when futures are already clear from descriptions, when you are asking what one option means, when the choice turns on whether an analogy or account licenses its inferences (`/ground`), when only real evidence can settle the decision, or when the candidate field is too thin to compare.

### Three Breach Conditions

The protocol's legitimacy lives in a survival chain: spec relay → probe generation → the map → your closing → cleanup verification.

| Breach | Guard |
|--------|-------|
| A divergence axis that commits a probe value before it was relayed with its basis | The spec relay goes out before any generation, and any drafted element can be sent back at any round |
| A write to a permanent project file | Temp isolation + cleanup registered at creation |
| A probe treated as evidence for any claim | A probe stays evidence for no claim in the harvest and in every remnant; evidence comes from what is read or run for real, never from a probe |

</details>

<a name="install"></a>
<a name="author"></a>
<details>
<summary>Install and author</summary>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install proplasma@epistemic-protocols
```

Author: Jongwon Choi (https://github.com/jongwony)

</details>
