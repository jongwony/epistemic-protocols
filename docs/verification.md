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
11. **cross-ref-scan**: Protocol name and deficit → resolution pair consistency across CLAUDE.md and all SKILL.md files, distinction table completeness, graph.json edge type allowlist verification
12. **onboard-sync**: Onboard SKILL.md Data Sources table, protocol count, Phase 0 category groupings, `references/scenarios.md` scenario blocks, `references/workflow.md` slash commands — all cross-checked against `PROTOCOL_FILES`
13. **precedence-linear-extension**: Verifies CANONICAL_PRECEDENCE total order is a valid linear extension of graph.json precondition partial order
14. **partition-invariant**: Verifies MODE STATE pairwise disjoint partition invariants — universe set and partition members exist as MODE STATE fields
15. **catalog-sync**: Catalog SKILL.md protocol coverage — all protocol names and commands present, count verified against `PROTOCOL_FILES`
16. **gate-type-soundness**: TYPES answer coproducts matched against Phase prose option enumerations — detects gate mutation (option injection/deletion/substitution) via stem matching. Warning level (safeguard). Type-preserving materialization permitted
17. **artifact-self-containment**: Validates the packaged runtime-contract view — transformed `Skill.md`, plugin description metadata, and packaged support entries. Fails on contributor-doc leakage or broken packaged references; warns on weak invocation/routing cues
18. **single-axis-soundness**: Enforces `TOOL GROUNDING`'s `(constitution)`/`(extension)` markers as the sole runtime annotation axis across live `*.md` files. Whitelisted paths: `docs/analysis/`, `docs/audit-*`, `.claude/skills/audit-delta/`, `.claude/worktrees/`, `.claude-pr/`, `node_modules/`, `dist/`, `.git/`. Source-of-truth banned-vocabulary list lives in the check function itself (`checkSingleAxisSoundness`)
19. **agents-symlinks-sync**: Verifies `.agents/skills/` (Agent Skills specification path used by Cursor, GitHub Copilot, Devin, OpenCode, Codex CLI, Gemini CLI per [agentskills.io](https://agentskills.io)) materializes every `<plugin>/skills/<name>/` source as a relative symlink with matching target. Fails on missing, extra, non-symlink, or mis-targeted entries. Repair via `scripts/sync-agents-symlinks.sh`
20. **workflow-paths-sync**: Verifies `.github/workflows/claude-epistemic-review.yml` `on.pull_request.paths` declares every protocol plugin directory (derived from `PROTOCOL_FILES`). Prevents new protocols from silently missing the multi-perspective epistemic review trigger (Issue #258 pattern: `anamnesis/` and `periagoge/` omitted at workflow inception). Utility plugin `epistemic-cooperative/` is intentionally out of scope. Repair: add the missing `- '<plugin>/**'` entry under `paths`

## Packaging Transformations

`scripts/package.js` applies non-trivial transforms when building release ZIPs:
- Renames `SKILL.md` → `Skill.md` (marketplace case convention)
- Strips frontmatter fields: `allowed-tools`, `license`, `compatibility`, `metadata`
- Overrides descriptions exceeding 200 chars (`frame`, `catalog`)
- Excludes `agents/`, `commands/`, README files from ZIPs
- 500-line guideline per SKILL.md (warns if exceeded)

## Runtime Contract Surfaces

`artifact-self-containment` does not inspect source prose in isolation. It checks the runtime-contract view that users actually encounter:

- `Skill.md`: normative contract for protocol semantics, phases, gates, and usage
- Plugin `description` metadata: discovery/routing hint only; intentionally weaker than `Skill.md`
- Packaged support entries: bundled `references/` or local assets that `Skill.md` links to

Two implications follow:

- Contributor/governance docs (`CLAUDE.md`, `.claude/rules/`, `docs/mission-bridge.md`, analysis docs) are not allowed runtime dependencies.
- Plugin descriptions operate under a tight marketplace budget, so they are evaluated for routing clarity, not for full semantic completeness.

Claim-strength boundaries for these surfaces are summarized in [runtime-dependency-ledger.md](runtime-dependency-ledger.md).
