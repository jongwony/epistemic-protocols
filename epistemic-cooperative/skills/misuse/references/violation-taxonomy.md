# Violation Taxonomy

Contract integrity criteria for `/ground` (Analogia) and `/induce` (Periagoge) invocations. Loaded by Phase 2 of `/misuse` to classify candidate invocations as `LEGITIMATE`, `VIOLATION`, or `AMBIGUOUS`.

## Vocabulary (A2 Cognitive Partnership Move)

The classification axis distinguishes Extension (relay-mode) from Constitution (gated-mode). Five verification indicators:

| Indicator | Extension (relay mode) | Constitution (gated mode) |
|-----------|------------------------|---------------------------|
| Deterministic | Result uniquely determined by environment | Multiple valid results |
| Citable | External source is the basis | AI inference is the basis |
| Within boundary | Action stays within protocol scope | Action crosses protocol boundary |
| Entropy → 0 | Single possible action | Selection among alternatives |
| Basis cited | Relay source is visible at point of visibility | Resolution basis is opaque |

A violation occurs when a Constitution-tier act (selection among alternatives, AI inference as basis, scope crossing) is executed as if it were Extension (no Constitution interaction, no user confirmation, no cited basis).

## /ground (Analogia) Contract

### Phase 0 input contract

- `R` = text containing abstract structures (source-agnostic: AI output, user analysis, or external reference)
- `Sₐ` = source domain (abstract structure extracted from R)
- `Sₜ` = target domain (user's concrete application context)
- Activation predicate: `∃ structure(s, Sₐ) : ¬established(correspondence(s, Sₜ))`

The contract assumes `Sₐ` is extractable from `R`. If `Sₐ` is absent from `R` and the AI must invent it to satisfy Phase 1, the substitution-shaped interface produces output that looks like validated mapping but is actually inductive synthesis.

### Built-in SKIP rule

`/ground`'s own SKILL.md Phase 0 contains the following SKIP directive:

> "Colimit-shape detection — assess whether `R` is a colimit-shaped input — 3+ concrete instances surfaced without a pre-existing abstract structure to map into. If both criteria hold, Analogia's substitution interface forces source-domain confabulation; nudge to `/induce`."
> — `analogia/skills/ground/SKILL.md` Phase 0 step 3

`/misuse` detects cases where this SKIP directive was not followed: `/ground` was invoked on colimit-shaped input, the SKIP did not fire, and the AI proceeded to confabulate `Sₐ`.

### Violation: Sₐ Confabulation

- **Definition** — AI binds `Sₐ` in Phase 1 output without any prior user message containing the same abstract structure. A Constitution-tier act (selecting which abstract domain to apply, with multiple valid results, basis = AI inference) executed as Extension (no user gate, no citable external source).
- **Detection signals** (textual):
  - `/ground` invoked, and 10–20 prior user-message turns contain no named framework, model, or analogy that the AI later identifies as `Sₐ`
  - The assistant turn immediately after `/ground` contains explicit `Sₐ:` binding, "Source domain:", "Abstract:", or equivalent labeling that names a framework
  - The named framework's identifier (or any close paraphrase) does not appear in any user message in the pre-context window
  - User pre-context contains 3+ concrete instances and no structuring framework — the colimit shape that `/ground` Phase 0 step 3 asks to deflect
- **Heuristic precision** — N=1 corroboration only; the corpus this taxonomy was derived from is single-user. False positives are corrected by the AMBIGUOUS default tie-break (Phase 2 step 3 of `/misuse`).
- **Operation-kind verification (step 2 of self-stereotype guard)**:
  - Did the AI's Phase 1 output read out an existing structure (Extension), or did it propose one (Constitution)?
  - Read-out: framework identifier appears verbatim or in close paraphrase in prior user turns; AI is populating a known structure
  - Propose: framework identifier first appears in AI text after `/ground`; AI is selecting the structure
  - VIOLATION applies only when propose is the operation actually performed

### Counter-signals (LEGITIMATE)

- The framework identifier (or close paraphrase) appears in user pre-context, even if not directly adjacent to the `/ground` invocation
- The session opened on a meta-document (CLAUDE.md, a paper, an architecture spec) where the framework is already in scope at the session level — `R` extends beyond the current session window
- The `/ground` argument explicitly cites a framework name the user supplied earlier in conversation

## /induce (Periagoge) Contract

### Phase 0 gate predicate

- `in_process(A) ≡ essence_sensed(A) ∧ ¬located(A)`

Where:
- `essence_sensed` — variation-stable core signal present in conversation (user sensing language: "something about these cases", "the pattern I'm seeing", "왜 이게 자꾸") OR AI-inferable core pattern
- `¬located` — no settled name, scope, or positional claim for the abstraction

Instance count is NOT a gate — it is evidence for sensing, not a precondition. The Phase 0 directive in `periagoge/skills/induce/SKILL.md` is explicit: "Instance count is evidence for the sensing, not a gate on activation."

### Look-alikes (operations sharing surface shape, distinct cognitive operation)

`/induce` shares surface shape ("multiple instances under examination") with three other protocols. The cognitive operation differs:

1. **Prothesis (`/frame`)** — frame selection. Multiple candidate readings already named, user selecting between them. Surface signal: candidate names exist in pre-context; the operation is selection-between, not formation-of.
2. **Syneidesis (`/gap`)** — gap surfacing in a pending decision. Multiple considerations enumerated for audit. Surface signal: a decision is pending with pros/cons enumeration; the operation is audit, not crystallization.
3. **Analogia (`/ground`)** — mapping validation. An abstract structure already exists; the operation is checking correspondence, not forming the abstraction.

### Violation: Stereotype Misconflation

- **Definition** — `/induce` activated on the surface stereotype "unnamed pattern + N instances" when the cognitive operation actually performed is one of the look-alikes. The AI treated instance count as the activation gate, contradicting the Phase 0 predicate's explicit rejection of instance count as gate.
- **Detection signals** (textual):
  - **`/frame` misconflation**: pre-invocation user turns contain `vs`, `versus`, `between X and Y`, `comparing`, `Option [A-Z]`, or other named-candidate-comparison patterns. The user is choosing between named candidates, not crystallizing an unnamed essence.
  - **`/gap` misconflation**: pre-invocation user turns contain `should I`, `risk`, `tradeoff`, `decide`, `commit` near instance accumulation. The user is auditing a decision, not crystallizing an essence.
  - **`/ground` misconflation**: pre-invocation context contains a named framework being checked against instances. The framework already exists; the operation is mapping validation, not abstraction formation.
- **Counter-signals (LEGITIMATE `/induce`)**:
  - User essence-intuition language: "something about these", "the pattern", "why does this keep", "왜 자꾸", "feels like there's a name for this"
  - No named candidates in pre-context window
  - AI Phase 1 output proposes a candidate name not present in any prior turn
  - Convergent variation across instances (instances span project / time / session-type axes, suggesting eidetic essence)
- **Heuristic precision** — N=1 corroboration only.
- **Operation-kind verification (step 2 of self-stereotype guard)**:
  - Did the user signal essence-sensing (Periagoge legitimate) or candidate selection / decision audit / framework application (look-alike)?
  - Look-alike triggers AMBIGUOUS unless the look-alike pattern is unambiguous in pre-context

### Violation: `/frame` Over-extension (separate class, evidence-pending)

- **Definition** — `/frame` remained active when `/induce` should have been handed off. Source: `feedback_framing_blind_recursion.md`. The `/frame` skill produces 5+ converged perspectives, the user independently proposes a candidate name within or after the frame analysis, and no `/induce` invocation followed.
- **Detection signals**:
  - `/frame` session reaches 5+ converged perspectives (perspective count visible in `/frame` output structure)
  - User message after `/frame` synthesis contains a coined name pattern (a noun phrase the AI did not propose, used as if naming the synthesized abstraction)
  - No `/induce` invocation followed within the next several turns
- **Status** — Pattern documented but **not in `/misuse` v1.0 detector scope**. Defer to Stage 2 expansion when retention evidence accumulates. Current v1.0 classifies this as Emergent and surfaces it only as AMBIGUOUS with note, not as a primary VIOLATION class.

## False-Positive Guard (Self-Stereotype Avoidance)

The `/misuse` classifier itself must not commit the same stereotype error it detects. Apply 2-step check on every candidate:

1. **Surface shape match** — does the invocation pattern superficially resemble a violation type?
2. **Operation-kind verification** — examine whether the cognitive operation actually performed matches the violation pattern. Read pre-context and post-output for operation evidence, not just shape evidence.

Outcome rules:
- Both steps confirm violation → `VIOLATION`
- Step 1 matches but step 2 produces uncertain result → `AMBIGUOUS`, not `VIOLATION`
- Step 1 does not match → `LEGITIMATE`

The default on uncertainty is `AMBIGUOUS`. False-positive cost (eroded protocol use, classifier loss of trust) exceeds false-negative cost (missed violation surfaceable on later re-audit).

## N=1 Dogfooding Caveat

All heuristics in this taxonomy were derived from a single user's session corpus during the design and observation period for `/misuse` v1.0. Patterns are working hypotheses with N=1 corroboration, not population evidence. Stage 2 corroboration is pending: variation-stable retention evidence across user profiles and platform contexts is required before promoting any heuristic from "working hypothesis" to "validated criterion".

`/misuse` Phase 5 emit must surface this caveat in the ViolationReview artifact so downstream readers (including future sessions) inherit the epistemic limitation.

## Stage 2 Expansion Path (Reserved)

When variation-stable retention evidence accumulates, this taxonomy may expand:

- **Other protocols** — `/clarify`, `/goal`, `/inquire`, `/bound`, `/attend`, `/contextualize`, `/recollect`, `/grasp`, `/frame`, `/gap` each have Phase 0 contracts whose violations could be detected by analogous criteria. Each expansion requires its own evidence base before inclusion.
- **`/frame` over-extension** as a primary VIOLATION class once the 5+perspective + coined-name + no-`/induce`-followup pattern is observed across multiple sessions.
- **Cross-protocol violation classes** — patterns like "Telos GoalContract auto-resolved by AI without user gate" require cross-protocol evidence and are deferred until that evidence appears.

Expansion proposals should follow the Stage 1 / Stage 2 split in `meta-principle.md §Deficit Empiricism`: Stage 1 compile checks (operation-kind clarity, falsifiability) precede Stage 2 retention evidence.
