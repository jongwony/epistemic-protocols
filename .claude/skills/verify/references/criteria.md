# Verification Criteria

Quality criteria for epistemic protocol verification, organized by severity. Each Critical criterion names the channel that enforces it: a static check (the `check` name in `static-checks.js` output), or **review** — a judgment the Static verification boundary in `AGENTS.md` routes to Phase 2 expert review or `/realize` rather than to a static check.

## Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **Critical** | Breaks semantic correctness or causes runtime failure | Static-check channel: a `fail` result, which fails the Lean CI job. Review channel: surfaced as a critical finding for the user to address or dismiss |
| **Concern** | May cause confusion or inconsistency | Surface for user review |
| **Note** | Informational, stylistic, or optimization | Log for awareness |

`lean-definition` blocks only where a Lean toolchain is reachable; without one it emits a `warn` locally, and the Lean CI job, which always has the toolchain, treats that `warn` as an error.

## Critical Criteria

### Structural Integrity

- **Required sections present** (`structure`): Definition, Mode Activation, Protocol, Rules, PHASE TRANSITIONS, MODE STATE
- **Lean Definition block elaborates** (`lean-definition`): the block elaborates standalone, the package builds with warnings as errors, and the Lean audit admits no axiom beyond the documented judgments
- **Phase transitions cover every phase** (review): every phase the prose names has a transition in PHASE TRANSITIONS
- **Mode state carries what the phases read** (review): every field a transition or rule reads is in the state type

### Type-Theoretic Soundness

- **Function signatures complete** (`lean-definition`): every declaration has an explicit type; elaboration rejects one that does not
- **Match totality** (`lean-definition`): a `def` defined by cases covers every constructor; elaboration rejects a non-exhaustive match
- **Transition coverage** (review): an `inductive` transition relation admits a step from every state the protocol can reach — a relation's coverage is not something elaboration decides
- **Refinement types well-formed** (`lean-definition`): a constraint written as a `Prop` or subtype elaborates

### Instruction Consistency

- **Supersession non-conflict** (review): different protocols supersede different domains
- **Activation determinism** (review): trigger conditions are unambiguous
- **Gate mandate** (`tool-grounding`): an operation annotated `constitution` realizes as the file's Realization header binds it (TextPresent+Stop), not as a non-stopping presentation
- **Emit load discipline coverage** (`emit-load-discipline`): core protocol SKILL.md Rules include Round composition and Form feedback as self-contained runtime instructions

### Tool Grounding Integrity

- **Section present** (`tool-grounding`): `── TOOL GROUNDING ──` section exists in all protocols
- **Phase reference** (`tool-grounding`): each `dispatch` binding's operation constructor is named in PHASE TRANSITIONS
- **Internal marking** (review): an operation that calls no external tool says so in its grounding description (e.g. `Internal analysis:`)
- **Interaction kind annotation** (`tool-grounding`): annotations come from the TOOL GROUNDING vocabulary, and convergence carries an explicit `extension` or `constitution` classification
- **Realization header** (`tool-grounding`): the `-- Realization:` header distinguishes the two realizations (e.g., `Constitution → TextPresent+Stop; Extension → TextPresent+Proceed`)

## Concern Criteria

### Mathematical Precision

- **Categorical terminology accuracy**: limit/colimit used correctly for intended semantics
- **Notation consistency**: Unicode symbols used throughout (→ not ->)
- **Diagram coherence**: Referenced diagrams have defined structure

### Cross-Document Consistency

- **CLAUDE.md sync**: Summaries match authoritative source files
- **Flow formula equivalence**: Quoted formulas match definitions
- **Version alignment**: plugin.json versions reflect changes

### Directive Language

- **Tool verb consistency**: Use `call` for tool invocations (strongest binding)
- **Third-person descriptions**: Skill descriptions use "This skill should..."
- **Imperative form**: Instructions use verb-first format

## Note Criteria

### Style and Convention

- **README sync**: README.md and README_ko.md match content
- **Comment clarity**: Complex logic has explanatory comments
- **Example completeness**: Examples are runnable and documented

### Optimization Opportunities

- **Context efficiency**: Large content moved to references/
- **Script efficiency**: Repeated logic extracted to scripts/
- **Progressive disclosure**: Information structured by access frequency

## Verification Decision Matrix

| Finding Type | Severity | Channel | Default Action |
|--------------|----------|---------|----------------|
| Missing required section | Critical | `structure` | Block: static-check `fail` |
| Missing TOOL GROUNDING section | Critical | `tool-grounding` | Block: static-check `fail` |
| Lean block fails to elaborate, or a non-exhaustive match | Critical | `lean-definition` | Block: static-check `fail` (CI; `warn` locally without a toolchain) |
| Uncovered transition in a transition relation | Critical | review | Surface with explanation, user addresses or dismisses |
| Supersession conflict | Critical | review | Surface with explanation, user addresses or dismisses |
| Tool grounding mismatch | Concern | `tool-grounding` / review | Surface, user decides |
| Incorrect categorical term | Concern | review | Surface, user decides |
| ASCII notation fallback | Concern | `notation` | Surface, user decides |
| Directive verb mismatch | Concern | `directive-verb` | Surface, user decides |
| README out of sync | Note | review | Log for awareness |
| Version not bumped | Note | `version-staleness` | Log for awareness |

## User Override Policy

A static-check `fail` blocks through CI; locally the user may still proceed, and the CI job fails until it is fixed. Every review-channel finding is **advisory**. For either, the user may:

1. **Address**: Fix the issue before proceeding
2. **Dismiss**: Acknowledge and proceed (decision logged)
3. **Proceed anyway**: Skip all remaining findings (decision logged in commit)

Dismissal rationale should be recorded for future reference.
