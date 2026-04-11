# Frozen Audit Configuration

This file is the static configuration source for `audit-delta`. All entries are derived from the c059212d session and its output `docs/audit-2026-04-11.md`. Do not modify this file in routine delta runs — modifying it changes the audit pattern itself, which is a meta-decision that belongs in a fresh heavy audit, not in delta tracking.

## Origin

- **Session ID**: `c059212d-aba4-4665-9b16-616e0420d60e`
- **Session location**: stored under each user's local Claude Code projects directory as `c059212d-aba4-4665-9b16-616e0420d60e.jsonl` — the exact parent path varies per machine and per project encoding
- **Baseline report**: `docs/audit-2026-04-11.md` (337 lines)
- **Protocol chain**: Hermeneia (5-gap clarification) then Prosoche (10 materialized tasks, 4 Claude general-purpose subagents plus Codex CLI dual-stream) then Entropy Triage (Deterministic Queue plus Design Decision Matrix)
- **Repository**: `jongwony/epistemic-protocols`

The audit explicitly excluded: the `src/` landing page, CI workflows, iterative refinement (handled by `/verify` and `/reflect`).

## Audit Issue Conventions

The c059212d session crystallized design decisions into GitHub issues following two conventions:

- **Title prefix**: A bracketed Korean tag character literal — see file `audit-issue-prefix.txt` co-located in this references directory for the exact byte sequence. The skill loads this file at runtime via Read **and must strip trailing whitespace** (including the trailing newline that text editors typically append) before using the value as a substring matcher.
- **Body sections**: Korean prose (Background, Decision Options, Recommendation, References).

The prefix is used only for matching during Phase 4 emergent scan. New audit-relevant issues are not required to use this prefix — the file-path and keyword filters in Phase 4 catch issues that share scope without the explicit tag.

### Phase 4 Filter Set

Phase 4 emergent scan filters newly created issues by matching against this set of signals. An issue is included in the emergent results if **any** signal matches the issue title or body:

1. **Title prefix** — the byte sequence loaded from `audit-issue-prefix.txt` (after whitespace strip).
2. **Track Alpha file paths** — every entry from "Scope: Track Alpha (Mission/Vision)" below.
3. **Track Beta file paths** — every entry from "Scope: Track Beta (Soundness)" below.
4. **Deterministic Queue target paths** — every target file path enumerated in "Deterministic Queue (DQ1 through DQ8)" below. This union is critical: some DQ targets (notably DQ2's `epistemic-cooperative/.claude-plugin/plugin.json`) sit slightly outside the strict Track Alpha 10-protocol scope. Without this union step, a commit to such a file would silently miss the emergent filter.
5. **Keywords** — any of the following terms anywhere in the issue title or body:
   - `axiom`
   - `MORPHISM`
   - `TYPES`
   - `formal block`
   - `falsifiability`
   - `Deficit Empiricism`
   - `vocabulary`
   - `soundness`

When the project's epistemic vocabulary evolves (for example, a future heavy audit introduces a new term), update this keyword list — not the SKILL.md procedure prose. SKILL.md Phase 4 references this section by name precisely so that filter parameters can be edited in one location.

## Scope: Track Alpha (Mission/Vision)

Mission and vision sources audited in c059212d. The original report says "28 source entries" composed of 4 base files plus 10 protocol plugin manifests plus additional entries. The exact 14-entry enumeration below reflects the marketplace's protocol category as of the baseline date; non-protocol plugins (write, reflexion, epistemic-cooperative) are excluded based on the "Epistemic Core" scope statement in the baseline report.

Base files (4):

- `CLAUDE.md`
- `README.md`
- `README_ko.md`
- `.claude-plugin/marketplace.json`

Protocol plugin manifests (10):

- `prothesis/.claude-plugin/plugin.json`
- `syneidesis/.claude-plugin/plugin.json`
- `hermeneia/.claude-plugin/plugin.json`
- `katalepsis/.claude-plugin/plugin.json`
- `telos/.claude-plugin/plugin.json`
- `aitesis/.claude-plugin/plugin.json`
- `analogia/.claude-plugin/plugin.json`
- `prosoche/.claude-plugin/plugin.json`
- `epharmoge/.claude-plugin/plugin.json`
- `horismos/.claude-plugin/plugin.json`

**Note on enumeration ambiguity**: `docs/audit-2026-04-11.md` line 15 says "10 plugin.json descriptions" but does not enumerate which 10. The selection above is inferred from the baseline report's "Epistemic Core" scope language. If a future heavy audit explicitly includes utility plugins (write, reflexion, epistemic-cooperative), update this list accordingly. DQ2 in the Deterministic Queue does target `epistemic-cooperative/.claude-plugin/plugin.json`, which slightly contradicts the strict 10-protocol reading — flagged here for the next heavy audit cycle.

## Scope: Track Beta (Soundness)

Soundness sources audited in c059212d.

Protocol skill definitions (10):

- `prothesis/skills/frame/SKILL.md`
- `syneidesis/skills/gap/SKILL.md`
- `hermeneia/skills/clarify/SKILL.md`
- `katalepsis/skills/grasp/SKILL.md`
- `telos/skills/goal/SKILL.md`
- `aitesis/skills/inquire/SKILL.md`
- `analogia/skills/ground/SKILL.md`
- `prosoche/skills/attend/SKILL.md`
- `epharmoge/skills/contextualize/SKILL.md`
- `horismos/skills/bound/SKILL.md`

Rules files (4):

- `.claude/rules/axioms.md`
- `.claude/rules/derived-principles.md`
- `.claude/rules/architectural-principles.md`
- `.claude/rules/meta-principle.md`

## Anchor Issues

Five issues were opened by the c059212d session as crystallizations of the Design Decision Matrix. All five were OPEN with no labels at baseline (2026-04-11). They form a root-pattern hierarchy where #237 is the root and #239, #240, #241 are sub-instantiations, while #238 is an independent Track Alpha manifestation of the same root pattern.

| Issue | Rank | Role | Title (truncated) | Baseline State |
|-------|------|------|-------------------|----------------|
| #237 | 1 | Root | Pre-formal vocabulary usage — formal/philosophical claim and inscribed rigor 2x gap | OPEN, no labels |
| #238 | 2 | Track Alpha manifestation | Mission/machinery bridge — Track Alpha convergence point | OPEN, no labels |
| #239 | 3 | A4 sub-instantiation | A4 Semantic Autonomy tier reconsideration — Await platform-dependency partial falsification | OPEN, no labels |
| #240 | 4 | Empiricism sub-instantiation | Deficit Empiricism N greater than 3 redefinition — Millian induction in phenomenological clothing | OPEN, no labels |
| #241 | 5 | A7 sub-instantiation | A7 Adversarial Anticipation falsifiability — self-referential conventionalist twist | OPEN, no labels |

URLs follow the pattern `https://github.com/jongwony/epistemic-protocols/issues/<N>`.

**Closure semantics**: Closing #239, #240, or #241 individually is meaningful but does not imply #237 is resolved. Closing #237 itself requires a demonstration that the project's claimed rigor matches its inscribed rigor — that demonstration cannot be inferred from issue state alone (see SKILL.md Caveats section 3).

**Phase 2 root propagation**: SKILL.md Phase 2 includes a propagation step that examines whether any sub-instantiation (#239, #240, or #241) changed state since baseline. If so, the report flags #237 as `needs re-evaluation` regardless of #237's own state. Resolving a sub-instantiation may either narrow or expand the root pattern's surface, and only the user can judge which — the propagation step exists to surface the question, not to answer it.

## Deterministic Queue (DQ1 through DQ8)

Items in this queue are mechanically resolvable (entropy then 0). Each entry was extracted from the baseline report's "Deterministic Fix Queue" section.

### DQ1 — Prothesis A7 guard consistency violation (Severity: High)

- **Target**: `prothesis/skills/frame/SKILL.md` lines 248, 250, 555
- **Problem**: Phase prose says "Do NOT skip this phase" plus Rules say "Always present Mission Brief", but ELIDABLE CHECKPOINTS marks the same gate as `elidable`. These guards contradict each other.
- **Completion criterion**: Either (a) keep "Do NOT skip" and remove the gate from ELIDABLE CHECKPOINTS, or (b) keep `elidable` and soften the Phase prose to "Present Mission Brief when Phase 0 classification requires."
- **Source analysis**: Codex Track Beta internal analysis (Task #6). A7 itself inscribes "Adversarial guards must be internally consistent. Contradictory guards lower AI confidence."

### DQ2 — Description duplication drift verification (Severity: High)

- **Target**: `epistemic-cooperative/.claude-plugin/plugin.json` line 3 versus `.claude-plugin/marketplace.json` (the epistemic-cooperative entry)
- **Problem**: Codex Task #2 caught actual wording divergence between the two manifests. The two fields are independently maintained, so drift accumulates silently.
- **Completion criterion**: Either (a) verify the drift and restore parity, or (b) introduce a parity check (a `scripts/verify-plugin-parity.js` script, or a new static check in `.claude/skills/verify/scripts/static-checks.js`).
- **Source analysis**: Codex Track Alpha internal — SSoT discipline.

### DQ3 — Prosoche `DetectedDeficit` dead type (Severity: Medium)

- **Target**: `prosoche/skills/attend/SKILL.md` lines 84, 86
- **Problem**: The TYPES block declares `DetectedDeficit` as a record type, but the actual router uses `d in Detect(C)` directly. The type is formally dead.
- **Completion criterion**: Either (a) make the router actually use the `DetectedDeficit` constructor, or (b) remove the declaration.
- **Source analysis**: Track Beta internal Task #6. Dead types are noise in the formal apparatus.

### DQ4 — Epharmoge gate-type-soundness alignment (Severity: Medium)

- **Target**: `epharmoge/skills/contextualize/SKILL.md` lines 41, 48, 81
- **Problem**: The Answer coproduct `A in {Confirm(mismatch), Adapt(direction), Dismiss}` carries an `Adapt(direction)` payload that is not reflected in the Phase 1 gate prose.
- **Completion criterion**: Either (a) make the gate option explicit about the direction field, or (b) simplify to a payload-free form.
- **Source analysis**: Track Beta internal — matches the project's own gate-type-soundness static check warning.

### DQ5 — Tension-Accumulation Threshold realization consistency (Severity: Medium)

- **Target**: `.claude/rules/meta-principle.md` line 59 (definition) plus the "revision threshold" prose blocks across multiple SKILL.md files
- **Problem**: The meta-principle defines Tension-Accumulation as a comparative cost test. Most protocols realize it as a flat "3+ sessions cluster" trigger. Only Syneidesis explicitly states the cost-comparison form.
- **Completion criterion**: Either (a) align all protocol revision-threshold prose to match the meta-principle's cost-comparison definition, or (b) update the meta-principle to also accept the flat-trigger pattern (bidirectional reconciliation).
- **Source analysis**: Track Beta internal cross-file consistency check.

### DQ6 — Notation first-mention explanation (Severity: Low)

- **Target**: `CLAUDE.md` near line 7, or the protocol enumeration section of `README.md`
- **Problem**: The arrow `Deficit -> Resolution` is introduced without a type-signature explanation. A reader cannot tell whether it denotes logical implication, state transition, or a morphism.
- **Completion criterion**: Add one inline note such as "(Notation: `X -> Y` denotes a deficit resolution morphism — the protocol transforms state X into state Y via its formal phases.)"
- **Source analysis**: Track Alpha "Register gap" finding plus Track Beta notation hygiene.

### DQ7 — Derived principles annotation gap (Severity: Low)

- **Target**: `.claude/rules/derived-principles.md`
- **Problem**: D3 (Full Taxonomy), D4 (Convergence Evidence), and D6 (Zero-Shot Instruction Preference) import empirical grounding beyond their cited axiom sources, but the imports are not annotated.
- **Completion criterion**: Add a derivation comment to each principle, such as "A_N plus empirical observation (Deficit Empiricism grounded)".
- **Source analysis**: Track Beta rules-sources Task #5.

### DQ8 — Gadamerian "Aufschreibung" rename (Severity: Low)

- **Target**: `.claude/rules/meta-principle.md`, the Hermeneutic Circle Evolution Model section
- **Problem**: "Aufschreibung" (inscription) is not a Gadamerian or Husserlian phase. The German borrowing implies a false philosophical pedigree.
- **Completion criterion**: Either (a) rename to "Inscription step" or "Documentation phase", or (b) keep the term and add a disclaimer "(project-specific addition, not a Gadamerian phase)".
- **Source analysis**: Track Beta external Husserl/Gadamer anchor. Resolution direction aligns with issue #240.

### Note: DQ9 (Optional)

The baseline report mentions a DQ9 ("Korean translation audit") classified as Optional / null finding (positive evidence). It is **not counted** in the 8-item Deterministic Queue because it has no failing observation to mechanically resolve. The skill ignores DQ9 unless a future heavy audit promotes it.

## Minimal Viable Core (Regression Watch)

Six structural elements that the c059212d session marked as "retain or strengthen regardless of which remediation path is chosen". The skill watches their target files for any commit activity since baseline; activity is not necessarily regression but warrants user attention.

| MVC | Element | Watch target file(s) |
|-----|---------|----------------------|
| MVC1 | A2 Detection with Authority (Husserl passive/active synthesis correspondence) | `.claude/rules/axioms.md` |
| MVC2 | Local protocol typed state (Λ, Σ records — MLTT-friendly fragment) | All 10 protocol SKILL.md files (see Track Beta) |
| MVC3 | Convergence evidence traces (per-item MORPHISM resolution) | All 10 protocol SKILL.md files |
| MVC4 | Anti-mutation rules (Rule 19 / Rule 20 gate integrity) | All 10 protocol SKILL.md files |
| MVC5 | Epistemic Cost Topology (execution cost then 0 versus epistemic meta-layer cost) | `.claude/rules/architectural-principles.md` |
| MVC6 | Hermeneia falsification conditions (Rule 17 protocol-local Popperian discipline exemplar) | `hermeneia/skills/clarify/SKILL.md` |

When MVC2/MVC3/MVC4 watch targets overlap with all 10 SKILL.md files, the skill should report the union of touched files once and tag which MVC element each touched file is associated with — do not produce 30 duplicate rows.

## Reference Documents

- Baseline report: `docs/audit-2026-04-11.md`
- GitHub repo: `https://github.com/jongwony/epistemic-protocols`
- Original session JSONL: `c059212d-aba4-4665-9b16-616e0420d60e.jsonl` under each user's local `~/.claude/projects/<project-encoded>/` directory (exact parent path varies per machine)

## Statelessness

This skill is **stateless by design**. Each delta run recomputes from three live sources:

1. The current contents of git (commits since baseline, via `git log`)
2. The current state of GitHub issues (via `gh` CLI)
3. This frozen-config.md file

Prior delta reports under `docs/audit-delta-*.md` are **not** read by subsequent runs. If the user marks a DQ as resolved in the Recommended Actions section of `docs/audit-delta-2026-04-18.md`, the next run on 2026-04-25 will not see that mark — DQ status is recomputed purely from git log activity in the target file.

Rationale: introducing inter-run state would create a second source of truth distinct from the issue tracker, undermining the Issue-centric design choice that motivated the whole skill. If a DQ is truly resolved, the appropriate action is one of:

- Close the corresponding tracking issue (gh state captured by next run)
- Comment on the relevant anchor issue with the resolution evidence (gh comment captured by next run)
- Remove the DQ entry from this frozen-config.md file (see Maintenance section below for when this is appropriate)

Each of these mutates a live source rather than relying on a delta-report annotation that the skill cannot observe.

## Maintenance

This file is **frozen**. The only legitimate reasons to edit it are:

1. **Heavy audit re-run** — a fresh c059212d-style audit produces a new baseline. Update Origin, Anchor Issues, Deterministic Queue, and Minimal Viable Core to reflect the new findings. Bump the baseline date in Origin.
2. **Scope drift correction** — the project structure changes (a new protocol added, a rules file moved) and the Track Alpha or Track Beta lists become incorrect. Update only the affected entries.
3. **Issue resolution after closure** — if an anchor issue is closed and the user judges the closure as final-and-permanent, the corresponding Anchor Issues row may be removed. Do not remove DQ entries this way; the DQ is a static historical record.

Routine delta runs do **not** modify this file. The skill reads it; it does not write to it.
