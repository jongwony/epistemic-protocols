# Hermeneutic Cycle

Part-whole reinterpretation via backward flow. The pattern is already structurally encoded in formal blocks across protocols; this file names the family and catalogs the surfaces on which the cycle is observed in this project.

## Pattern over Vocabulary

The hermeneutic cycle pattern is already structurally encoded in formal blocks — renaming blocks to philosophical terminology adds no structural value. Pattern recognition takes precedence over vocabulary transition.

| Formal Block | Gadamerian Concept | Role |
|---|---|---|
| `preserves:` (MORPHISM) | Vorverständnis (pre-understanding) | Fixed reference point across the circle. Input is read-only; only understanding (output) evolves |
| `invariant:` (MORPHISM) | Produktives Vorurteil (productive prejudice) | Directional constraint on the circle. "X over Y" pattern prevents degenerative interpretation |
| `LOOP` | Hermeneutischer Zirkel (hermeneutic circle) | Part-whole reinterpretation via backward flow. Present in every protocol |
| `CONVERGENCE` | Horizontverschmelzung (horizon fusion condition) | Convergence condition for achieved understanding. Productive termination of the circle |
| `Qs` gate | Horizon Fusion Point | Constitutive gate — user contributes new meaning, fusing horizons |
| `Qc` gate | Horizon Navigation | Classificatory gate — path selection within existing understanding space |

Gate-runtime semantics for Qc/Qs (and the `Basis:` interpretive transparency annotation) live in `docs/structural-specs.md`; this file holds the cycle's structural definition and surface catalog.

## Observed surfaces

Each surface operationalizes the same structural pattern at a different scale. Cross-references point to where the cycle is invoked in the codebase; this file is the single home for the *concept*, not its runtime invocation.

**Primary circle (intra-protocol)** — Each protocol's `LOOP` section encodes backward flow where partial resolution triggers whole re-interpretation, conditioned by `preserves:` (the text being interpreted remains fixed; only the interpretation evolves).

**Secondary pattern (inter-protocol)** — Complementary pairs form Pre/Post cycles on the context fitness axis — Aitesis↔Epharmoge (context), Prothesis↔Analogia (structure). These cycles operate heuristically via Output Style nudge, driven by observed session conditions rather than graph.json structural edges. See Dual Advisory Layer in `.claude/principles/architectural-principles.md`.

**Tertiary surface (inter-session)** — Cross-Session Knowledge Composition via Anamnesis's hypomnesis store. Each protocol's Phase 0/1 can leverage accumulated domain knowledge to narrow scan scope and improve detection precision. Operational definition in `.claude/principles/architectural-principles.md` (Cross-Session Knowledge Composition section). Local-inscription mechanism in `anamnesis/skills/recollect/SKILL.md`; cross-session task persistence in `epistemic-cooperative/skills/comment-review/SKILL.md`. Operational detail (spiral mechanism + Aitesis asymmetry + pollution caveat) in `docs/structural-specs.md` § "Cross-Session Tertiary Pattern".

**Inter-version surface (온고지신 / 溫故知新)** — VCS history (commits, PRs, issues) as substrate informing present design. The pattern: surveying past inscriptions to inform present judgment, then inscribing the present decision back into the substrate for future sessions. Operationalized in `epistemic-cooperative/skills/dispatch/SKILL.md` — "issue body + redirection inscription" preserves rejection traces so the next fresh-context session engages the cycle without re-deriving. PR review-loop chains (e.g., #353–#371 Rules consolidation cascade) realize the same pattern at the commit/PR level.

**Inter-agent surface (Constitution-as-Horizontverschmelzung)** — Every Phase 2 Constitution gate is a horizon fusion point. The user's horizon merges with the AI's pre-understanding (Vorverständnis), and the gate answer becomes the productive prejudice (Produktives Vorurteil) constraining the next cycle. Formal correspondence: A2 Constitution kind (`axioms.md`) is the gate-level realization of horizon fusion; the `Qs` gate row in the Pattern over Vocabulary table is its formal mapping.

**Operational axis (closure / categorization)** — Hermeneutic-cycle availability acts as a closure clause in autonomous decisions. `epistemic-cooperative/skills/dispatch/SKILL.md` invokes it for Extension-default closure (the "northstar + hermeneutic circle" closure clause), for "hermeneutic respect" toward substrate-locked items, and as a categorization axis bounding Periagoge's induce. The availability is itself a profile variable: `hermeneutic_circle_availability` in `epistemic-cooperative/skills/steer/SKILL.md`.

## Operational implications

- **Closure visibility** — `Has-Cycle` vs `No-Cycle` profile state determines whether a decision can be relay-resolved (Extension-default) or requires Constitution.
- **Substrate respect** — "skip with hermeneutic respect" acknowledges that an evidence-gate is part of the cycle; premature attempts violate substrate-first.
- **Cross-version traceability** — Issue / PR inscriptions surviving across sessions are the substrate of the inter-version surface; severing them breaks the cycle's backward reach.
- **Authoring placement (invariant / horizon test)** — At inscription time, content mapping to `preserves` / `invariant` blocks (stable references, productive prejudices) compiles to T1 auto-load; content mapping to `LOOP` / `CONVERGENCE` blocks (revisable interpretations, fusion-conditioned outputs) belongs in T2–T3 lazy-load or `docs/`. Per Tier Factorization, this prevents compiling horizons that should remain hermeneutically revisable. External research substrate for the test: issue #402.

## Naming

"Hermeneutic cycle", "hermeneutic circle", and "Hermeneutischer Zirkel" are synonyms. Default to "hermeneutic cycle" in prose; "Hermeneutischer Zirkel" when explicitly mapping to `LOOP` block; profile-variable form `hermeneutic_circle_availability` preserved as identifier convention. "Tertiary hermeneutic circle" is the historic label for the inter-session surface (`.claude/principles/architectural-principles.md:19`) — new prose prefers "Tertiary surface" or names the scale (Cross-Session Knowledge Composition).

## Tier

Lives in `.claude/principles/` (axis_β = T2–T3, lazy-load, authoring/verify-time invocation). Per Tier Factorization (`.claude/rules/architectural-principles.md`), this file names the family for authoring coherence; runtime detection is operationalized at each surface (LOOP blocks at runtime, hypomnesis store at session boundary, VCS at inter-version scale, Constitution gate per Phase 2).
