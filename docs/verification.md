# Verification & Packaging

## Static Checks

Run `/verify` before commits. Static checks via:
```bash
node .claude/skills/verify/scripts/static-checks.js .
```

**Static checks performed**:
1. **json-schema**: plugin.json required fields (name, version, description, author), semver format, name format (`/^[a-z][a-z0-9-]*$/`)
2. **notation**: Unicode consistency (→, ∥, ∩, ∪, ⊆, ∈, ≠ over ASCII fallbacks)
3. **directive-verb**: `call` (not `invoke`/`use`) for tool instructions
4. **xref**: Referenced file paths exist in expected locations
5. **structure**: Required sections in protocol SKILL.md (Definition, Mode Activation, Protocol, Rules, PHASE TRANSITIONS, MODE STATE)
6. **tool-grounding**: TOOL GROUNDING section present, external operations have `[Tool]` notation in PHASE TRANSITIONS
7. **version-staleness**: plugin content changed without plugin.json version bump (git-aware, warn level; skips during merge/rebase conflicts; ignores README, LICENSE, .gitignore)
8. **graph-integrity**: graph.json node/edge validation — edge-type allowlist, edge-reference check, node-directory existence, orphaned node detection (SKILL.md presence), isolated node detection (no edges), precondition DAG acyclicity (Kahn's algorithm)
9. **spec-vs-impl**: TYPES definitions cross-referenced against PHASE TRANSITIONS and prose — detects rename drift, dead types, and resolution type mismatches
10. **morphism-anatomy**: SKILL.md Definition block formal integrity — FLOW → MORPHISM → TYPES section order, MORPHISM source object distinct from canonical deficit (deficit belongs in `requires:` precondition), required clauses (`requires`/`deficit`/`preserves`/`invariant`) all present, MORPHISM chain terminates in canonical resolution, Type signature exposes `deficit → resolution` pattern
11. **cross-ref-scan**: Protocol name and deficit → resolution pair consistency across all SKILL.md files, README concern-cluster invariant, cross-enumeration completeness (`PROTOCOL_FILES`, graph nodes, marketplace entries), graph.json edge type allowlist verification
12. **onboard-sync**: Onboard SKILL.md Data Sources table, Phase 0 category groupings, `references/scenarios.md` scenario blocks, `references/workflow.md` slash commands — all cross-checked against `PROTOCOL_FILES`
13. **precedence-linear-extension**: Verifies CANONICAL_PRECEDENCE total order is a valid linear extension of graph.json precondition partial order
14. **partition-invariant**: Verifies MODE STATE pairwise disjoint partition invariants — universe set and partition members exist as MODE STATE fields
15. **catalog-sync**: Catalog SKILL.md protocol coverage — all protocol names and commands present, count verified against `PROTOCOL_FILES`
16. **gate-type-soundness**: TYPES answer coproducts matched against Phase prose option enumerations — detects gate mutation (option injection/deletion/substitution) via stem matching. Warning level (safeguard). Type-preserving materialization permitted
17. **artifact-self-containment**: Validates the packaged runtime-contract view — transformed `SKILL.md`, plugin description metadata, and packaged support entries. Fails on contributor-doc leakage or broken packaged references; warns on weak invocation/routing cues
18. **emit-load-discipline**: Verifies every core protocol SKILL.md carries the compiled-copy runtime rules for Context-Question Separation, Plain emit discipline, and Round-local salience bundling; also verifies the Output Style source contains the shared vocabulary, bundling, and drift-tracking sections
19. **framing-readout-enforcement**: Couples the Epistemic Ink invariant (user-facing protocol surfacing is a framing readout, never a scalar progress meter) to an enforcement channel. Two coupled fails: (a) the unicode progress-bar glyphs ▓/░ must not appear in any core protocol SKILL.md or the Output Style source `epistemic-cooperative/styles/epistemic-ink.md` — they only ever rendered a completion bar; (b) the Output Style must retain the categorical-ban guard sentence (`bar, percentage, or N-of-M tally`) so the invariant cannot be silently deleted. Scope mirrors emit-load-discipline (core protocols + Output Style); utility skills that legitimately render bars (e.g. `/dashboard`) are out of scope. Repair: delete the progress-bar glyph, or restore the guard sentence in the Output Style
20. **single-axis-soundness**: Enforces `TOOL GROUNDING`'s `(constitution)`/`(extension)` markers as the sole runtime annotation axis across live `*.md` files. Whitelisted paths: `docs/analysis/`, `docs/audit-*`, `.claude/skills/audit-delta/`, `.claude/worktrees/`, `.claude-pr/`, `node_modules/`, `dist/`, `.git/`. Source-of-truth banned-vocabulary list lives in the check function itself (`checkSingleAxisSoundness`)
21. **language-purity**: Surfaces Korean characters (Hangul syllable block U+AC00–U+D7A3) in project text files at warn-level under a Stage 1 surface posture. Detection uses charCode range comparison so the verifier file remains self-pure under its own check. Whitelist preserves intentional Korean regions: `**/README_ko.md`, `**/README.md` (English README + Korean localization link), `.claude/skills/release/**`, `src/**` (landing-page i18n), `**/docs/` and root `docs/` (repo and per-plugin documentation), `**/references/` (plugin contributor references), `**/graph.json` (`satisfies` field is Korean by project convention), `design/**`, `examples/**`, `.claude/rules/editing-conventions.md`. Promotion from warn to fail is gated on Stage 2 retention evidence accumulating across multiple PRs and contributors
22. **codex-manifest-sync**: Verifies each plugin's `.codex-plugin/plugin.json` `version` matches the canonical `.claude-plugin/plugin.json`. version-staleness inspects only the claude manifest and `walkFiles` skips dot-directories (so json-schema cannot reach the codex manifest either) — this is the codex manifest's only parse/version guard. Fail level: blocks at the same `/verify` gate the claude bump passes through, preventing the recurring "version bump missed codex-plugin" drift (PR #449 remediation pattern). Codex variant is optional; equality is enforced only when the file is present. Repair: bump the codex manifest to the claude version in the same commit
23. **packaged-agent-contract-sync**: Verifies each packaged agent carrying a `### Realization:` verdict anchor stays in sync with its paired SKILL.md in the same plugin (paired by matching the agent's realization value set to a TYPES enumeration). Reconciles the realization set, the Advisory Disposition vocabulary (against a TYPES enumeration), and the Checklist categories (against the paired SKILL.md). For an F5 zero-memory-verdict contract (detected by an F5 marker on either side — the agent's Findings/Category-sweep verdict tables or the SKILL.md `EvidencedFinding`/`SweepTrace` records), it additionally locks the verdict-table column schema bidirectionally against those records and anchors the checklist search to the F5 contract corpus; a non-F5 pairing keeps the generic checks only. Fail level. Repair: sync the drifted surface (agent or SKILL.md) named in the message. First materialization of the "commit-form" sync obligation for `diylisis/agents/zero-memory-refuter.md ↔ distill` (Issue #532)
24. **routing-index-contract**: Verifies CLAUDE.md/AGENTS.md keeps a `## Protocol Index` section that routes to the authoritative sources (`/catalog`, `graph.json`, per-protocol `SKILL.md`, README) — pointers are matched *within* the section, so an incidental mention elsewhere (e.g. `SKILL.md` in the Runtime Contract prose) cannot satisfy the contract. Fail level for a missing section or a missing routing pointer. Also warns if the removed inline catalog is reintroduced (a `## Protocol Reference` heading or a `| Concern | Protocols |` cluster table). Lightweight successor to the removed CLAUDE.md-content mirror sub-checks in cross-ref-scan: enforces the routing contract (structure + pointers), not mirrored content, so catalog drift is caught without re-creating the co-change chain. Repair: restore the Protocol Index routing pointers, or remove the reintroduced inline catalog
25. **formal-blocks-rule**: Verifies every core protocol SKILL.md carries the "Formal blocks are runtime-normative" rule — the compiled-copy statement that FLOW/MORPHISM/TYPES/PHASE TRANSITIONS/etc. are LLM-facing and constitutive of protocol identity (they type the prose), not contributor-only spec (see `docs/structural-specs.md`). Fail level. Repair: add the missing rule statement to the protocol's `## Rules` section
26. **gate-integrity-rule**: Verifies every core protocol SKILL.md carries a `(Safeguard tier)`-tagged Gate integrity rule whose entry states the invariant kernel phrase `type-preserving materialization` (see `.claude/rules/axioms.md` §Gate Integrity). The mutation taxonomy (injection/deletion/substitution) is expressed in per-protocol specialized vocabulary and is deliberately not word-anchored by the check. Fail level. Repair: add the missing tagged rule to the protocol's `## Rules` section
27. **gate-firing-anchor**: Verifies the Output Style source `epistemic-cooperative/styles/epistemic-ink.md` carries the "Gate firing precondition" element with its three kernel phrases inside the element's bounded body (label line to the next Ink element label or heading): `fires as classified` (protocol classification controls by default), `an uncited skip is not a relay but a silent gate omission` (relay collapse carries a citation obligation), and `never overrides a protocol's TOOL GROUNDING classification` (the outside-protocol reversibility test stays subordinate). Kernel-anchored: surrounding phrasing is free to evolve; only the kernels are pinned. Fail level. Repair: restore the missing kernel phrase within the Gate firing precondition element

## Review Criteria Not Yet Static Failures

Use these checks during protocol edits and reviews. Do not promote them to static failure until a pilot protocol shows the criterion is stable with low false positives.

- Canonical resolution names stay protocol-native; they should implement `DeficitResolved<D, R>` rather than be renamed to it.
- Resolution definitions expose a completion trace: the terminal type should make the path from deficit through phase operations to resolution inspectable.
- Residual unknowns are declared with disposition. Empty residuals must be explicitly declared; silent absence is not enough.
- `ConstitutionSurface<T>` is a typed pre-gate surface before `Qc` or `Qs`, not a replacement for `Constitution`, `Extension`, `Qc`, or `Qs`.
- Pressure maps must be protocol-native and decision-relevant. Discovery pressure is limited to bounded residual unknowns that could materially change the next user judgment.
- These checks compile invariants only: do not freeze horizon content, philosophical lens choice, or broad exploratory context into runtime/static requirements.

## Packaging Contract

`scripts/package.js` uses one deterministic `SKILL.md` archive builder for both GitHub Release and Codex submission ZIPs:

- Preserves `<skill>/SKILL.md` exactly and uses `.codex-plugin/plugin.json` as the version source; a differing Claude manifest version fails closed.
- Strips frontmatter fields: `allowed-tools`, `license`, `compatibility`, `metadata`.
- Applies compact description overrides when the source description exceeds 200 characters.
- Includes runtime support files and directly referenced plugin agents while excluding unrelated agents, commands, evals, README files, and forbidden secret/session paths.
- The default release selects every active skill and adds the all-skills bundle plus release notes. Its support-file surface is a safe superset for utility sidecars such as `routing-map.md`, `templates/`, and `adapters/`.
- `--profile codex-submit` selects the explicit public-core set, enforces its narrower support allowlist and full packaged-text reference closure, and emits `submission-index.json` with byte sizes and SHA-256 digests.
- The line-count guideline is 510 lines per SKILL.md and remains warning-only.

## Runtime Contract Surfaces

`artifact-self-containment` does not inspect source prose in isolation. It checks the runtime-contract view that users actually encounter:

- `SKILL.md`: normative contract for protocol semantics, phases, gates, and usage
- Plugin `description` metadata: discovery/routing hint only; intentionally weaker than `SKILL.md`
- Packaged support entries: bundled runtime files that `SKILL.md` loads or links to

Two implications follow:

- Contributor/governance docs (`CLAUDE.md`, `.claude/rules/`, `docs/mission-bridge.md`, analysis docs) are not allowed runtime dependencies.
- Plugin descriptions operate under a tight marketplace budget, so they are evaluated for routing clarity, not for full semantic completeness.

Claim-strength boundaries for these surfaces are summarized in [runtime-dependency-ledger.md](runtime-dependency-ledger.md).
