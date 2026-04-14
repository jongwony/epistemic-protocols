# Editing Conventions

## Git Conventions

- **Commit message**: `type(scope): Korean description` — type ∈ {feat, fix, refactor, style}, scope = plugin name
- **Branch naming**: `feat/name-protocol`, `refactor/description`, `fix/description`
- **PR body language**: Korean (hook-enforced)
- **Release tag**: CalVer `v{YYYY}.{MM}.{DD}[.{N}]` — tag push triggers CI release (`gh release create --draft`)

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Protocol table maintained in README.md (navigation hub format)
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` for tool references, `present` for gate operations (tool-agnostic verb)
- Skills frontmatter: `name` (required), `description` (required, quote if contains `:`), `allowed-tools` (optional), `license`, `compatibility`, `metadata`

## Notation — Prime Succession

`'` (prime) is reserved for **temporal succession** only (`X → X'`). Practical readability holds up to `X''`; 3+ succession levels MUST use unique subscripts to avoid ambiguity.

**Partition branching** (classify outputs, splits) uses unique subscripts per member, NOT prime. Example: `Bᵢ = Bᵢ' ∪ Bᵣ` where prime marks enrichment (temporal) but `Bᵢ` vs `Bᵣ` uses distinct subscripts for partition.
