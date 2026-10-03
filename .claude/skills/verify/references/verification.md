# Verification & Packaging

## Static Checks

Run `/verify` before commits. Static checks via:

```bash
node .claude/skills/verify/scripts/static-checks.js .
```

**The scripts are the check inventory.** `static-checks.js` names the layer files it runs, and each layer file's `CHECKS` list is what runs; what each check does, which files it walks, and what it treats as fail versus warn are read from those files themselves. A prose inventory here would be a hand-maintained copy with nothing re-running it: correct on the day it was written, then quietly asserting an earlier reading of a file that has since moved — and a reader who trusts it stops at a contradiction the script never raised.

What this page carries instead is the part the script does not: why a check exists where the reason is not obvious from its code, and what to do when one fires.

### Why certain checks exist

- **codex-manifest-sync** — `version-staleness` reads only the Claude manifest's version, and no other check parses the Codex manifest. Without this check the Codex manifest has no parse or version guard at all, which is how the "version bump missed codex-plugin" drift kept recurring.
- **framing-readout-enforcement** — protocol surfacing is a framing readout of the work in play, not a progress meter, and a progress-bar glyph in a core protocol `SKILL.md` is the mechanical trace of that drift. Utility skills may draw bars and are out of scope.
- **routing-index-contract** — enforces the routing contract (structure plus pointers) rather than mirrored content, so protocol drift is caught without re-creating the co-change chain that mirroring the protocol table into an instruction file would impose.
- **emit-load-discipline** — a packaged `SKILL.md` cannot reach an output style at runtime, so a protocol's round-composition and form-feedback rules must be inscribed in its own `## Rules` section. The check guards that the labels `REQUIRED_RULES` names exist there; whether the wording is still right is review's, and the audit is the "Round composition / Form feedback wording change" row in [co-change.md](co-change.md).
- **lean-definition** — a Definition block authored in Lean 4 (`docs/structural-specs.md` §Lean Notation) is a contract only if it elaborates, so reference resolution for such a block is the elaborator's. The judgment is Lean's: the checked-in audit (`lean/Audit/`, run as `lake lint`) reads declaration ownership, kind, doc strings, guarantees, `Nonempty` witnesses and transitive axioms from the elaborated environment, because text matching cannot establish those. TOOL GROUNDING is judged there too, by reducing `grounding` at each operation (`auditGrounding` in `lean/Audit/Check.lean`): what an annotation is, and whether a hand-off is wired into the contract, follow from the elaborated definitions, where a text pattern reads a comment as readily as a declaration. The check orchestrates it and keeps what is text: every protocol in the canonical registry (`scripts/load-protocols.js` `CANONICAL_PROTOCOL_SET`) enrolled with a Lean block, so a protocol that has none fails rather than dropping out of what is audited; each shared section identical to its canonical module — GROUND to `lean/EpistemicProtocols/Ground.lean`, and the vocabulary opening TOOL GROUNDING to `lean/EpistemicProtocols/ToolGrounding.lean`, each replaced by that module in the generated contract; no theorem stated in a block doc comment, where no audit reads it; a `lean/EpistemicProtocols/<Namespace>/Theorems.lean` for every block, importing only its contract and the shared sections; no unaccounted `.lean` file under `lean/` (the audit and its fixtures under `lean/Audit` and `lean/Tests` are tooling); and a token preflight — no `sorry`, `admit`, `set_option`, `native_decide`, `implemented_by`, `extern`, `unsafe`, or metaprogramming command in the block, the canonical GROUND, or a Theorems module. With `lean` and `lake` reachable it elaborates the block standalone and runs `lean-contract.js`'s one driver: generate the contract modules, `lake build --wfail`, `lake lint` — whose verdict is its exit status as well as its readout, so a status the readout does not account for fails. With no toolchain it warns that elaboration was not run rather than passing; the `lean` workflow makes one reachable, so CI never takes the warn path. Whether the model realizes the elaborated contract at runtime stays with `/realize`.
- **version-staleness** — a plugin shipped with changed content under an unchanged version reaches users as the version they already hold, so a changed plugin must carry a higher `plugin.json` version than it had at the base its change lands on. That base is the merge-base with the pull request's base branch in CI, else with `origin/main`, else `HEAD`; measuring from it is what lets a clean CI checkout see a committed change, and it is why the `lean` workflow checks out full history. A branch that bumped in an earlier commit is not asked to bump again.
- **language-purity** — warn level under a Stage 1 surface posture. Promotion to fail is gated on Stage 2 retention evidence accumulating across multiple PRs and contributors, not on a single clean run.

### Repair

When a check fires, the fix is usually one of these:

| Check | Repair |
|---|---|
| `codex-manifest-sync` | Bump the Codex manifest to the Claude version in the same commit |
| `framing-readout-enforcement` | Delete the progress-bar glyph from the protocol `SKILL.md` |
| `lean-definition` | Restore a shared section — GROUND, or the vocabulary opening TOOL GROUNDING — to its canonical module's text, and change the canonical module when the vocabulary itself changes; annotate `.converge` as an interaction; drop a realization restated at the head of a description; wire a `dispatch` operation into the declaration that decides when it hands off; prove or remove the `sorry`; give an axiom judgment in the block a doc comment saying what is judged, and a `Nonempty` instance for its type in the Theorems module that uses no judgment's value; restate any other `axiom` as a judgment or a parameter; move an in-block proof or a doc-comment statement to `lean/EpistemicProtocols/<Namespace>/Theorems.lean` as a theorem stated and proved together; make a public theorem there say something about the contract, or make it `private`; fix the error the message quotes (`node .claude/skills/verify/scripts/lean-contract.js check .` runs generate, `lake build --wfail`, and `lake lint`; `lake test` runs the audit's own fixtures) |
| `packaged-agent-contract-sync` | Sync the drifted surface — agent or `SKILL.md` — named in the message |
| `version-staleness` | Bump the named plugin's `.claude-plugin/plugin.json` above its version at the base the message names, and its `.codex-plugin/plugin.json` to match; with no base (a shallow CI checkout), fetch full history |
| `routing-index-contract` | Restore the Protocol Index routing pointers (`route/README.md`, `SKILL.md`, `README`), or remove the reintroduced inline catalog |

## Tests

The command is in `CLAUDE.md` §Development, with the note on why the
static-check test takes its own invocation.

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

- **A `SKILL.md`'s body is preserved verbatim; its frontmatter is not.** `transformSkillMd()` parses the frontmatter, drops the strip-fields, and reserializes it, so the packaged file is not byte-identical to the source. Everything below the frontmatter is passed through unchanged — the packaging never rewrites the contract text — so what a runtime user reads there is what the repository holds.
- **A description override replaces an over-long description rather than exempting it.** The override answers to the same length limit it exists to satisfy, and `package.test.js` asserts the packaged description against it — so an override is not an escape hatch.

## Runtime Contract Surfaces

`artifact-self-containment` does not inspect source prose in isolation. It checks the runtime-contract view that users actually encounter: the packaged `SKILL.md`, the plugin `description` metadata, and the packaged support entries a `SKILL.md` loads or links to.

The boundary this enforces — which surfaces may be depended on from a packaged runtime contract, and which are governance surfaces that may not — is stated in `AGENTS.md` §Settled Directions (Surface authority order), and the claim-strength buckets those surfaces fall into are in `AGENTS.md` §Runtime Contract.
