# Hermeneutic-Cycle Inscribe-Kind Classification (issue #454)

> Design analysis for issue #454: classify each inscription in
> `.claude/principles/hermeneutic-cycle.md` as **Gadamer-kind** (a predictive /
> normative maxim — at risk of over-inscription) or **Lakatos-kind** (a reactive
> lemma incorporated in response to a concrete counterexample — healthy), then
> decide whether the file's meta-classification should change.
>
> This is a contributor-governance analysis doc, not a runtime-contract surface.
> It may reference `.claude/**` source paths freely.

## What #454 actually asks

#454 surfaced from an `/introspect` session in which the user named a self-pattern:
a *meta-epistemic inscription compulsion* — the pull to inscribe interpretive
maxims that, in Gadamer's reading, ought to stay living rather than be frozen into
rules. The cross-model consult re-mapped that shadow more precisely onto Lakatos
(*Proofs and Refutations*): a lemma incorporated **after** a counterexample is not
over-inscription — it is healthy theory growth. So the question is not "is
inscribing good or bad" but: **for each existing inscription in
`hermeneutic-cycle.md`, which kind is it?** Gadamer-kind inscriptions are the ones
the user's shadow warns against; Lakatos-kind inscriptions are legitimate.

The issue supplies a 3-step diagnostic, applied below to every inscription:

1. Is the inscription **predictive** ("interpret this way" ahead of time → Gadamer
   risk) or **reactive** (added after a concrete failed case → Lakatos, normal)?
2. Can the specific counterexample it responds to be written in one line? Yes →
   Lakatos; no → Gadamer risk.
3. Is the **original form** of the definition it patches traceable in git history as
   a counterexample-triggered change? Traceable → Lakatos; not → Gadamer.

## Re-derived classification (from the file + full git history)

The file's load-bearing inscriptions are the six rows of the **§"Pattern over
Vocabulary"** table (lines 11–16), plus three prose maxims elsewhere. Each was run
through the diagnostic against the complete VCS history of the table strings
(traced back through their origin in `design-philosophy.md` →
`docs/structural-specs.md` → this file).

### The six mapping-table rows

| Row → Gadamerian concept | line | Kind | One-line counterexample | Git evidence |
|---|---|---|---|---|
| `preserves:` → Vorverständnis | 11 | **Gadamer** | none | Forward glossary; originated `15fcf09`/`77718ae`/`435b62e`, moved verbatim to this file at `e28b385`. No counterexample-triggered patch. |
| `invariant:` → Produktives Vorurteil | 12 | **Gadamer** | none | Same lineage; introduced as an a-priori mapping, never edited against a failed case. |
| `LOOP` → Hermeneutischer Zirkel | 13 | **Gadamer** | none | One edit (`14fe466`) is a hardcoded-count removal for co-change maintenance, **not** a counterexample to the mapping. |
| `CONVERGENCE` → Horizontverschmelzung | 14 | **Gadamer** | none | Forward mapping; no patch event. |
| `Qs` gate → Horizon Fusion Point | 15 | **Gadamer** | none | Forward mapping; no patch event. |
| `Qc` gate → Horizon Navigation | 16 | **Gadamer** | none | Forward mapping; no patch event. |

### The three prose maxims

| Inscription | line | Kind | Git evidence |
|---|---|---|---|
| "Pattern recognition takes precedence over vocabulary transition" (section thesis) | 7 | **Gadamer** | Predictive normative maxim, born with the table. |
| Authoring-placement test (invariant/horizon) | 41 | **Gadamer** | `ae748b0` self-labels it a *"prospective authoring transform"* — forward-looking, not reactive. Cites #402 as research substrate but framed prospectively. |
| "Constitution-as-Horizontverschmelzung" inter-agent surface | 32 | **Gadamer** | A-priori interpretive assertion ("every Phase 2 gate *is* a horizon fusion point") added as enrichment at `e28b385`. |

**Verdict: every inscription in the file is Gadamer-kind. The working hypothesis
held — zero counterexample-triggered (Lakatos) patches exist for any row.** The only
row-level content edit in history (`14fe466`) is a maintainability wording fix, not a
reaction to a failed interpretation. (A genuine `CE1 반례` counterexample does appear
in `15fcf09`, but it patches an unrelated *BoundaryMap role* line in the Horismos
analysis doc — not these Gadamerian rows.) Confidence: **high** — a pickaxe sweep
across all-history for every row string returns only refactor/move/maintenance
commits.

## What the classification implies

Two facts now sit together:

1. **The file is uniformly Gadamer-kind** — exactly the inscription kind the user's
   shadow warns against.
2. **The file already knows this about itself.** Its own thesis (line 7) is *"renaming
   blocks to philosophical terminology adds no structural value; pattern recognition
   takes precedence over vocabulary transition."* The table exists to say *"the
   pattern is already encoded in the formal blocks — do not transition vocabulary."*

So the file is a Gadamer-kind glossary that is *self-aware about being one*. It is
not asserting that protocols should be re-described in Gadamerian terms; it is
naming a family for authoring coherence and explicitly discouraging the vocabulary
migration. The over-inscription risk #454 worries about is largely **pre-empted by
the file's own framing** — the maxims are presented as a recognition aid, demoted to
lazy-load T2–T3, not as runtime-normative interpretive rules.

This is the decisive point for the fork. There is **no Lakatos lemma in the file**,
so a "counterexample-that-triggered-this" column (fork B) would have **six empty
cells** — it would document the absence of counterexamples, which is itself a new
predictive meta-maxim. Adding meta-classification to a file whose entire thesis is
"don't over-inscribe vocabulary" is the over-inscription the issue is trying to
avoid. The classification's payoff is the *finding* (the file is uniformly
Gadamer-kind and self-aware), not a new permanent column.

## Fork

- **(A) Keep the Gadamer vocabulary as-is — most conservative.** The rows are a
  self-aware forward glossary already demoted to lazy-load and already discouraging
  vocabulary migration. No file change; the classification finding lives in this
  analysis doc.
- **(B) Add a Lakatos "counterexample-that-triggered-this" column.** Documents the
  inscribe-kind per row — but every cell is "none / forward maxim", so the column
  records an absence and adds a standing meta-maxim to a file built to resist exactly
  that.
- **(C) Split the two frames into separate sections** (Gadamer maxims vs Lakatos
  lemmas). Same objection as (B), structurally heavier: it builds a two-bin scaffold
  to hold zero items in one bin.

## Recommendation

**Fork (A) — keep the vocabulary; do not add meta-classification.** The
classification *confirms* the over-inscription concern is real in principle (the file
is uniformly predictive-maxim), but the file's own thesis already discharges it: it
tells authors not to migrate vocabulary, and it sits in lazy-load. Inscribing a
Lakatos column or a frame split would be a new predictive maxim — the very move the
issue's shadow warns against — to record that no reactive lemmas exist.

If the maintainer wants the diagnostic to keep paying forward (so *future*
inscriptions are checked), the lightest sufficient touch is **not** a new column but
one sentence folded into the existing **Authoring-placement** bullet (line 41), which
is already the file's authoring-time gate: *"At inscription time, prefer reactive
(counterexample-grounded) maxims; a purely predictive maxim that cannot name the
case it answers is a vocabulary-migration smell."* That keeps the diagnostic at
authoring time (where it belongs) without standing meta-classification of the
existing rows. This remains optional — the conservative default is no edit.

**Open fork for the human:** accept (A) with no file edit (recommended), or accept
(A) plus the single-sentence authoring-time diagnostic on line 41. (B) and (C) are
not recommended — they re-enact the over-inscription the issue exists to flag.

## Spec-edit sketch (only if the optional touch is taken)

In `.claude/principles/hermeneutic-cycle.md`, line 41 bullet "**Authoring placement
(invariant / horizon test)**", append one clause:

> … Per Tier Factorization, this prevents compiling horizons that should remain
> hermeneutically revisable. **Prefer reactive inscription: a maxim that cannot name
> the counterexample it answers is a forward (Gadamer-kind) glossary entry, not a
> lemma — keep such entries minimal and recognition-only.** External research
> substrate for the test: issue #402.

No version bump (principles file, not a packaged SKILL.md). `static-checks.js` stays
FAIL 0. **Do not touch line 30** — the 온고지신/溫故知新 CJK idiom is issue #564
(separate `docs/cjk-notation-policy.md`).
