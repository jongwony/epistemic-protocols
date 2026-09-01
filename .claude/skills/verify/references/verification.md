# Verification & Packaging

## Static Checks

Run `/verify` before commits. Static checks via:

```bash
node .claude/skills/verify/scripts/static-checks.js .
```

**The script is the check inventory.** What each check does, which files it walks, and what it treats as fail versus warn are read from `static-checks.js` itself. A prose inventory here would be a hand-maintained copy with nothing re-running it: correct on the day it was written, then quietly asserting an earlier reading of a file that has since moved — and a reader who trusts it stops at a contradiction the script never raised.

What this page carries instead is the part the script does not: why a check exists where the reason is not obvious from its code, and what to do when one fires.

### Why certain checks exist

- **codex-manifest-sync** — `version-staleness` inspects only the Claude manifest, and the file walk skips dot-directories, so `json-schema` cannot reach the Codex manifest either. Without this check the Codex manifest has no parse or version guard at all, which is how the "version bump missed codex-plugin" drift kept recurring.
- **framing-readout-enforcement** — two parts with different jobs. The glyph denylist is a regression guard over the surfaces where completion bars were observed; it is scoped by decision, not by any claim that a glyph means one thing on a given file category, and §Rendering Judgment sanctions a drawn length for an independently measured quantity on surfaces outside its range. The guard kernel is anchored *inside* the Cognitive work element rather than anywhere in the file, so it cannot migrate into a comment or frontmatter and still pass. That kernel is the element's positive statement of what it is: the Output Style body is injected every turn, so it is runtime motivating prose and states the intended path, while this reference and the check's own source comment are diagnostic substrate and name the failure case directly (`premise/instruction-authoring.md` §Prohibition Base Rate and White Bear Avoidance).
- **routing-index-contract** — enforces the routing contract (structure plus pointers) rather than mirrored content, so catalog drift is caught without re-creating the co-change chain that mirroring the catalog into an instruction file would impose.
- **ink-body-identity** — a per-turn injected Output Style cannot dereference a sibling file at runtime, so a verbatim copy is the only safe carrier. This check guards that copy against silent drift.
- **routing-map-sync** — the routing map is injected at SessionStart, so a stale committed map does not merely go unread; it injects a wrong routing directive into every new session.
- **gate-answer-reference** — resolves formal answers after `Stop` exactly against TYPES or transition-local declarations, MODE STATE fields, or a locally enumerated inline type. It reads the Definition only and fails on a dangling reference; context-dependent option materialization and semantic type realization belong to `/realize` or review under `AGENTS.md`'s static-verification boundary. `static-checks.test.mjs` proves the resolver with known-pass and known-fail runs rather than treating an empty match set as success.
- **language-purity** — warn level under a Stage 1 surface posture. Promotion to fail is gated on Stage 2 retention evidence accumulating across multiple PRs and contributors, not on a single clean run.

### Repair

When a check fires, the fix is usually one of these:

| Check | Repair |
|---|---|
| `codex-manifest-sync` | Bump the Codex manifest to the Claude version in the same commit |
| `framing-readout-enforcement` | Delete the progress-bar glyph, or restore the guard kernel within the affected Output Style's Cognitive work element |
| `ink-body-identity` | Re-sync the sibling's reproduced body to match the canonical file exactly |
| `packaged-agent-contract-sync` | Sync the drifted surface — agent or `SKILL.md` — named in the message |
| `routing-index-contract` | Restore the Protocol Index routing pointers, or remove the reintroduced inline catalog |
| `routing-map-sync` | `node scripts/generate-routing-map.js` |

## Tests

```bash
node --test scripts/package.test.js anamnesis/scripts/hypomnesis-write.test.mjs
```

`scripts/package.test.js` enforces the hand-maintained expected release-ZIP list; the static suite does not inspect that list, so a skill missing from it fails here and nowhere else.

## Review Criteria Not Yet Static Failures

Use these during protocol edits and reviews. Do not promote them to static failure until a pilot protocol shows the criterion is stable with low false positives.

- Canonical resolution names stay protocol-native; they should implement `DeficitResolved<D, R>` rather than be renamed to it.
- Resolution definitions expose a completion trace: the terminal type should make the path from deficit through phase operations to resolution inspectable.
- Residual unknowns are declared with disposition. Empty residuals must be explicitly declared; silent absence is not enough.
- `ConstitutionSurface<T>` is a typed pre-gate surface before `Qc` or `Qs`, not a replacement for `Constitution`, `Extension`, `Qc`, or `Qs`.
- Pressure maps must be protocol-native and decision-relevant. Discovery pressure is limited to bounded residual unknowns that could materially change the next user judgment.
- These checks compile invariants only: do not freeze horizon content, philosophical lens choice, or broad exploratory context into runtime/static requirements.

## Packaging Contract

`scripts/package.js` uses one deterministic `SKILL.md` archive builder for both the GitHub Release and Codex submission ZIPs. Read the script for what it strips, includes, and overrides; the constants it defines — the description-length threshold, the line-count guideline, the submission set — are defined there and are not restated here.

Two properties are worth knowing before reading it, because neither is obvious from the code alone:

- **A `SKILL.md` is preserved byte-for-byte.** Everything the packaging does is subtractive or additive around the file, never a rewrite of the contract text, so what a runtime user reads is what the repository holds.
- **A description override replaces an over-long description rather than exempting it.** The override answers to the same length limit it exists to satisfy, and `package.test.js` asserts the packaged description against it — so an override is not an escape hatch.

## Runtime Contract Surfaces

`artifact-self-containment` does not inspect source prose in isolation. It checks the runtime-contract view that users actually encounter: the packaged `SKILL.md`, the plugin `description` metadata, and the packaged support entries a `SKILL.md` loads or links to.

The boundary this enforces — which surfaces may be depended on from a packaged runtime contract, and which are governance surfaces that may not — is stated in `AGENTS.md` §Settled Directions (Surface authority order), and the claim-strength buckets those surfaces fall into are in `AGENTS.md` §Runtime Contract.
