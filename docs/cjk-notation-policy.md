# CJK / Non-Latin Notation Policy (issue #564)

> Design for #564: `.claude/principles/hermeneutic-cycle.md:30` carries the idiom
> **온고지신 / 溫故知新**, which the `language-purity` static check flags. The fix is
> not mechanical — the term is an intended concept name — so a policy is needed that
> generalizes beyond this one line.

## The diagnosis is sharper than "English-only"

The `language-purity` check is described as enforcing "English-only / zero-shot
portability". But the same file (`hermeneutic-cycle.md`) freely uses **German**
terms — `Vorverständnis`, `Produktives Vorurteil`, `Horizontverschmelzung`,
`Hermeneutischer Zirkel` — and the check never flags them. So the operative
convention is **not** "English-only". It is **Latin-script, zero-shot-portable**:

- German passes because it is written in Latin script and a zero-shot English-context
  model can read and transliterate it.
- 온고지신 fails because Hangul is non-Latin script — outside the portable surface a
  zero-shot reader is assumed to share.

Two facts confirm the convention is about *script*, not *language*:

1. **The check is Hangul-only.** It scans Unicode block U+AC00–U+D7A3 (precomposed
   Hangul syllables). So on line 30 the Hangul `온고지신` is flagged, but the CJK Han
   `溫故知新` is **not** — Han passes today by a *gap in the check*, not by being
   allowed. (kana, other CJK, etc. likewise slip the current regex.)
2. **The whitelist is a list of inherently-localized surfaces**, not a
   language-allowlist: `README_ko.md`, `README.md` (carries the localization link),
   `docs/**`, `.claude/skills/release/**` (release notes, Korean by purpose),
   `graph.json` (satisfies field, Korean by convention), and
   `.claude/rules/editing-conventions.md` (Korean commit-convention text). Every
   whitelisted surface is one whose audience or purpose is *intentionally* localized.

So the real question #564 poses is: **how does a portable surface name a concept whose
canonical form is non-Latin?** And the answer already exists in the same file for
German: **romanized Latin form + English gloss, native ideographs omitted.**

## The existing convention, made explicit

`Vorverständnis (pre-understanding)` is the template: native term in Latin script,
English gloss in parentheses, no non-Latin original. Korean/CJK terms should follow
the identical shape — the only difference is that "Latin form" for Korean means a
*romanization* (the native Hangul/Han is the non-Latin form to omit), whereas for
German the native spelling *is already* Latin.

This is **fork (a) romanize**, generalized into a rule:

> **Non-Latin notation policy.** In any *portable surface* (every file the
> `language-purity` check scans — protocol `SKILL.md`, `.claude/principles/**`,
> `.claude/rules/**` except `editing-conventions.md`, `references/**`, root files), a
> technical term whose canonical form is non-Latin (Korean, CJK Han, kana, …) is
> written as **romanized Latin + English gloss**, mirroring the German-term
> convention (`Vorverständnis (pre-understanding)`). The native non-Latin form is
> **omitted** from portable surfaces. It may appear only in *localized surfaces* — the
> existing `language-purity` whitelist (`README_ko`, `docs/**`, release notes,
> `graph.json` satisfies fields, `editing-conventions.md`).

For line 30: `온고지신 / 溫故知新` → **`Ongojisin (溫故知新 is the etymological root;
lit. "review the old to know the new")`** is *not* fully portable (Han remains). The
clean, German-parallel form is:

> **Inter-version surface (*Ongojisin* — lit. "reviewing the old to know the new")**

— romanized Latin name + English gloss, both Hangul and Han dropped. This passes the
check, survives a zero-shot context, and keeps the concept's name.

## Why not the other forks

- **(b) Remove the idiom, keep only an English concept name** ("inter-version
  surface" with no named idiom). Cleaner still, but it *loses the named concept* — the
  idiom is the compact handle the rest of the surface catalog leans on, and the file
  treats it as a first-class surface name alongside the German terms. Romanization (a)
  keeps the handle at no portability cost, so (b) discards value for nothing.
- **(c) Whitelist `hermeneutic-cycle.md`.** Wrong direction. The whitelist is for
  *inherently localized* surfaces; `hermeneutic-cycle.md` is a portable principle file
  (T2–T3 authoring guidance) whose whole point is zero-shot recognizability. Adding it
  to the whitelist would re-open the entire file to non-portable script and erode the
  convention the file itself depends on. Reject.

## Recommendation

**Fork (a) — romanize, inscribed as a general script-not-language policy.** It (i)
resolves line 30, (ii) generalizes (any future non-Latin term follows the German
template), and (iii) makes explicit what the convention *actually* is (Latin-script
portability), correcting the misleading "English-only" framing.

Home for the policy: **`.claude/rules/editing-conventions.md`** — it already owns the
"Notation" section and is itself the whitelisted Korean-commit-convention file, so the
policy and its one whitelisted exception sit together.

### Secondary decision: should the check broaden to match the convention?

The convention covers all non-Latin scripts, but the check is Hangul-only — so
`溫故知新` and any future Han/kana term pass silently. Two sub-options:

- **(i) Leave the check Hangul-only (recommended).** The convention covers intent; the
  check catches the common (Korean) case. Broadening the regex to all CJK/kana risks
  false positives on legitimately whitelisted quoted content and is a separable
  scope. Document that Han currently passes by a gap, so a reviewer doesn't read
  "check is green" as "fully portable".
- **(ii) Broaden the regex** to U+3400–U+9FFF (CJK) + kana blocks. Tightens
  enforcement to match the convention, at the cost of more false positives to
  whitelist. Only worth it if non-Korean CJK terms start appearing in portable
  surfaces.

Recommend **(i)** now; revisit (ii) if a Han/kana term recurs in a portable surface.

## Open fork for the human

1. **Notation form for line 30:** (a) romanize `Ongojisin` + gloss (recommended) /
   (b) drop the idiom entirely / (c) whitelist the file (not recommended).
2. **Check scope:** (i) keep Hangul-only + document the Han gap (recommended) / (ii)
   broaden the regex to all CJK.

## Spec-edit sketch (recommended path: a + i)

1. **`.claude/principles/hermeneutic-cycle.md:30`** — replace
   `**Inter-version surface (온고지신 / 溫故知新)**` with
   `**Inter-version surface (*Ongojisin* — lit. "reviewing the old to know the new")**`.
   This clears the standing `language-purity` warn at line 30.
2. **`.claude/rules/editing-conventions.md`**, "Notation" area — add the **Non-Latin
   notation policy** block quoted above (portable surface ⇒ romanized Latin + English
   gloss, mirroring German; native form only in whitelisted localized surfaces).
3. **`.claude/skills/verify/scripts/language-purity.js`** header comment — note that
   the scan is Hangul-only by design and that other non-Latin scripts are governed by
   the convention, not the regex (so the green check is not a full-portability proof).
4. No plugin version bump (principles + rules + verify-script comment, no packaged
   SKILL.md). Run `static-checks.js` — the line-30 warn drops, leaving the two benign
   pre-existing warns; **FAIL stays 0**.

Note for the worker-brief spec-health baseline: once edit (1) lands, the
`hermeneutic-cycle.md:30` warn disappears, so the documented "two pre-existing warns"
collapses to one (`anamnesis DerivedFrom` false positive).
