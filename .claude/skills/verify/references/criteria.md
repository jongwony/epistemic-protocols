# Verification Criteria

What `/verify` judges, which channel can judge each kind of obligation, and how much a finding costs. Channel and severity are separate dimensions: the channel follows from what can see the obligation, and severity from what a finding would break. Which channel holds which kind of obligation is settled in `AGENTS.md` §Settled Directions, Static verification boundary; this page applies that clause and does not restate it as a second authority.

No list here says what a particular check enforces. A check's predicate, its inputs, and whether it fails or warns are read from its layer file — `scripts/static-checks.js` names them — and from `lean/Audit/Check.lean` for the audit. A copy of those facts here would keep asserting an earlier reading once the code moved.

## Channels

### Lean contract

A protocol's contract structure — what its Definition block declares and what follows from it — is Lean's to check. The block must elaborate standalone and inside the package, its guarantees are stated and proved in its `Theorems.lean`, and the checked-in audit enforces the declaration policy over the elaborated environment. A verdict here is about what the block says: elaboration shows a declaration is well typed and a match total, not that the declaration carries the obligation the prose around it names. That correspondence is review's.

The bridge that hands the block to Lean is text, and lives in `lean-bridge.js`: extracting the block from Markdown, enrolling every canonical protocol's block as a contract module, keeping each section every block shares identical to its canonical module, the preflight that runs before any build, and reading the build's and the audit's verdicts. The bridge fails closed: a canonical protocol with no block, or with a block Lean never sees, is a failure rather than one fewer thing checked, and with no toolchain reachable the verdict is reported as not obtained, never as passed.

### Repository artifacts

`artifact-sync.js` gives mechanical verdicts on artifacts Lean does not see: plugin manifests and their versions, packaging and publication inventories, the surfaces that enumerate the protocols, copies that must stay identical to their source, the section schema of a protocol `SKILL.md`, and its public `Type:` signature against the MORPHISM its Definition block states. A verdict follows from the artifacts alone, so a required input that is missing fails rather than being skipped.

### Prose surface

`prose-surface.js` holds lexical obligations on Markdown and on the packaged runtime view: notation, directive verbs, language, retired vocabulary, runtime self-containment, and the literal presence of compiled-copy rules. Each holds only the literal obligation it names. Whether a restatement still agrees with its source, or whether the prose says the right thing, is review's.

### Review and `/realize`

What depends on context and meaning is judged by a reader: correspondence between prose and formal block, the fit of categorical and type-theoretic vocabulary, whether activation is unambiguous and supersession non-conflicting, whether a gate is realized as the right user-facing interaction under the accumulated context, and instruction design. `/verify` Phase 2 carries the review perspectives (`review-checklists.md`); runtime realization is `/realize`'s. A static check may confirm that such a channel is wired and fails closed; it does not stand in for the judgment.

## Severity

| Level | Definition | Action |
|-------|------------|--------|
| **Critical** | Blocks semantic correctness or causes runtime failure | Fix before commit |
| **Concern** | May cause confusion or inconsistency | Surface for user review |
| **Note** | Informational, stylistic, or optimization | Log for awareness |

Severity is assigned by what a finding would break, whichever channel produced it:

| Source | Severity |
|--------|----------|
| A static `fail`, from any layer | Critical |
| A static `warn` that a verdict was not obtained | Concern — obtain the verdict before relying on its absence |
| Any other static `warn` | Concern where it touches structure, Note where it touches style |
| A review finding | The severity the reviewer assigns (`critical` / `concern` / `note`) |

A `warn` blocks nothing by itself. Which results block in CI is read from `.github/workflows/lean.yml`.

## Review Criteria

What review reads for, by severity. Each is a judgment; none is a static predicate.

**Critical**

- **State machine totality against the prose**: every situation the prose describes has a transition in the formal block, and every transition the block admits is one the prose intends.
- **Supersession non-conflict**: different protocols supersede different domains.
- **Activation determinism**: trigger conditions are unambiguous.
- **Gate realization**: a user-facing gate is realized as structured presentation plus turn yield under the context it fires in, not bypassed as unstructured text.

**Concern**

- **Categorical terminology**: limit, colimit and the like are used for the semantics intended.
- **Formula and diagram coherence**: quoted formulas match their definitions, and referenced diagrams have defined structure.
- **Description form**: skill descriptions are third person and say when to use the skill; instructions are verb-first.

**Note**

- **Hand-maintained mirrors**: `README.md` and `README_ko.md`, and other surfaces no check compares, move together.
- **Clarity and disclosure**: complex logic carries its reason, examples are runnable, and material is placed by how often it is needed.

## User Override Policy

At `/verify`, findings are **advisory**. The user may:

1. **Address**: Fix the issue before proceeding
2. **Dismiss**: Acknowledge and proceed (decision logged)
3. **Proceed anyway**: Skip all remaining findings (decision logged in commit)

Dismissal rationale should be recorded for future reference. A dismissed static `fail` still blocks wherever CI blocks on it.
