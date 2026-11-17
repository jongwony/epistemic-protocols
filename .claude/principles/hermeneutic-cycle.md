# Hermeneutic Cycle

Part-whole reinterpretation via backward flow. The pattern is already structurally encoded in formal blocks across protocols; this file names the family and catalogs the surfaces on which the cycle is observed in this project.

## Pattern over Vocabulary

The hermeneutic cycle pattern is already structurally encoded in formal blocks — renaming blocks to philosophical terminology adds no structural value. Pattern recognition takes precedence over vocabulary transition.

| Formal Block | Gadamerian Concept | Role |
|---|---|---|
| `preserves:` (MORPHISM) | Vorverständnis (pre-understanding) | Fixed reference point across the circle. Input is read-only; only understanding (output) evolves |
| `invariant:` (MORPHISM) | Produktives Vorurteil (productive prejudice) | Directional constraint on the circle. "X over Y" pattern prevents degenerative interpretation |
| `LOOP` | Hermeneutischer Zirkel (hermeneutic circle) | Part-whole reinterpretation via backward flow |
| `CONVERGENCE` | Horizontverschmelzung (horizon fusion condition) | Convergence condition for achieved understanding. Productive termination of the circle |

## Observed surfaces

Each surface operationalizes the same structural pattern at a different scale. Cross-references point to where the cycle is invoked in the codebase; this file is the single home for the *concept*, not its runtime invocation.

**Primary circle (intra-protocol)** — A protocol's `LOOP` section, where its contract carries one, encodes backward flow where partial resolution triggers whole re-interpretation, conditioned by `preserves:` (the text being interpreted remains fixed; only the interpretation evolves).

**Secondary pattern (inter-protocol)** — A complementary pair forms a Pre/Post cycle on the context fitness axis — Aitesis↔Epharmoge (context). See Inter-Protocol Guidance in `.claude/principles/architectural-principles.md`.

**Inter-version surface** — VCS history (commits, PRs, issues) as substrate informing present design. The pattern: surveying past inscriptions to inform present judgment, then inscribing the present decision back into the substrate for future sessions. PR review-loop chains realize the same pattern at the commit/PR level.

**Inter-agent surface (Constitution-as-Horizontverschmelzung)** — Every Constitution gate is a horizon fusion point. The user's horizon merges with the AI's pre-understanding (Vorverständnis), and the gate answer becomes the productive prejudice (Produktives Vorurteil) constraining the next cycle. Formal correspondence: Detection with Authority's Constitution kind (`premise/recognition-and-authority.md`) is the gate-level realization of horizon fusion.

**Gated interaction realization**: Recognition over Recall (`premise/recognition-and-authority.md`) reaches gated interactions, including those whose subject is the reasoning itself — the same move that grounds this surface's horizon-fusion point above. Fusion needs the user's horizon to be able to exceed the presented options, which Context and Utterance as First-Class Ground (same file) supplies.

## Operational implications

- **Correction-channel evidence** — When calibrating a grant, assess feedback and recovery through `premise/calibration-methodology.md`. Resolve the decision's actual authority under `premise/recognition-and-authority.md`; a correction channel alone neither determines an answer nor grants discretion.
- **Substrate respect** — skipping an evidence-gate with hermeneutic respect acknowledges that the gate is part of the cycle; premature attempts violate substrate-first.
- **Cross-version traceability** — Issue / PR inscriptions surviving across sessions are the substrate of the inter-version surface; severing them breaks the cycle's backward reach.

## Naming

"Hermeneutic cycle", "hermeneutic circle", and "Hermeneutischer Zirkel" are synonyms. Default to "hermeneutic cycle" in prose; "Hermeneutischer Zirkel" when explicitly mapping to `LOOP` block.

## Tier

Use this family at authoring and verification time; load it under `.claude/principles/AGENTS.md` §Distinction from `.claude/rules/`. Each protocol or substrate states the operative loop, record, or checkpoint at its own binding moment.
