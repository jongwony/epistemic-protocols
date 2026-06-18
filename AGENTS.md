# AGENTS.md

This file provides always-loaded guidance for coding agents when working in this repository. Keep it short: put orientation, decision rules, and verification commands here; use linked docs and `rg` for recoverable detail.

## Northstar

Epistemic Protocols is a domain-free metalanguage of structured types and morphisms for human-AI collaboration: it reduces cognitive load by eliciting unknowns into utterance, constraining AI attention without bias, and resolving interaction deficits at their root within bounded loops before local misalignment hardens into system-wide rework.

## Settled Directions

Citable registry of conventions whose resolution direction is already constituted. The option-set relay test (in `.claude/rules/axioms.md`) cites a clause here to collapse settled-direction option-set entropy — a finding whose direction a clause below already determines is presented as relay, not gated. Maintained by `/steer`: a direction recurringly constituted the same way graduates into a clause here.

- **Settled direction collapses the ask** (reversible forks only): when a reversible fork's direction is already determined by stated project goals, an established sibling convention, or a declared calibration, the option-set is settled — proceed or relay rather than re-asking the question those sources already answer. Basis: recurring same-direction constitution in calibration practice; first inscribed with the settled-direction relay test (#538).

## Project Overview

This repository packages epistemic dialogue protocols as plugin skills. Each protocol transforms a specific interaction deficit into a resolution object, for example **FrameworkAbsent → FramedInquiry** (`/frame`), **GapUnnoticed → AuditedDecision** (`/gap`), **ContextInsufficient → InformedExecution** (`/inquire`), **MappingUncertain → ValidatedMapping** (`/ground`), and **AbstractAporia → ResolvedEndpoint** (`/elicit`).

The detailed protocol inventory lives in per-protocol `README.md` files, where present, and `skills/*/SKILL.md`. The dependency graph is authoritative in `.claude/skills/verify/graph.json`.

## Protocol Reference

Canonical protocol pairs:

| Protocol | Slash | Deficit → Resolution |
|---|---|---|
| Prothesis | `/frame` | FrameworkAbsent → FramedInquiry |
| Syneidesis | `/gap` | GapUnnoticed → AuditedDecision |
| Katalepsis | `/grasp` | ResultUngrasped → VerifiedUnderstanding |
| Horismos | `/bound` | BoundaryUndefined → DefinedBoundary |
| Aitesis | `/inquire` | ContextInsufficient → InformedExecution |
| Analogia | `/ground` | MappingUncertain → ValidatedMapping |
| Periagoge | `/induce` | AbstractionInProcess → CrystallizedAbstraction |
| Euporia | `/elicit` | AbstractAporia → ResolvedEndpoint |
| Prosoche | `/attend` | ExecutionBlind → SituatedExecution |
| Epharmoge | `/contextualize` | ApplicationDecontextualized → ContextualizedExecution |
| Elenchus | `/sublate` | ContextSuspect → VettedContext |
| Anamnesis | `/recollect` | RecallAmbiguous → RecalledContext |
| Diylisis | `/distill` | ContextTethered → PortableHandoff |
| Hyphegesis | `/conduct` | MethodUnderdetermined → ConductedMethod |

Protocols grouped by primary concern, ordered by activation sequence within each cluster. Simultaneous activation follows cluster order; users can override. Information flow: `graph.json` (authoritative source).

### Epistemic Concern Clusters

| Concern | Protocols |
|---|---|
| Planning | `/inquire` (Aitesis), `/elicit` (Euporia) |
| Analysis | `/frame` (Prothesis), `/ground` (Analogia), `/induce` (Periagoge) |
| Decision | `/gap` (Syneidesis) |
| Execution | `/attend` (Prosoche) |
| Verification | `/contextualize` (Epharmoge), `/sublate` (Elenchus) |
| Cross-cutting | `/bound` (Horismos), `/recollect` (Anamnesis), `/distill` (Diylisis), `/grasp` (Katalepsis), `/conduct` (Hyphegesis) |

Edge types: `precondition` must complete before target; `advisory` provides useful context but is not required; `suppression` prevents stacking similar protocols.

Initiator taxonomy:
- **AI-guided**: AI evaluates condition and guides the process (Prothesis, Syneidesis, Horismos, Aitesis, Analogia, Periagoge, Epharmoge, Anamnesis, Diylisis)
- **Hybrid**: Both user signal and AI detection can initiate; AI-detected trigger path requires user confirmation (Euporia, Hyphegesis)
- **User-initiated**: User signals awareness of a deficit; no AI-guided activation (Katalepsis, Prosoche, Elenchus)

## Runtime Contract

- Runtime users interact with packaged `SKILL.md` files plus plugin metadata. Discovery metadata routes; `SKILL.md` carries the normative user contract.
- `SKILL.md` must be self-contained. Do not require runtime readers to chase contributor-only docs, axiom identifiers, rule paths, design-philosophy documents, or mission/vision prose to understand the skill contract.
- Prescriptive changes that affect protocol behavior must be compiled into the relevant `SKILL.md` Rules sections.
- Claim-strength boundaries for runtime surfaces are tracked in `docs/runtime-dependency-ledger.md`.
- The formal blocks are part of the runtime-normative `SKILL.md` contract — they type the prose and constitute protocol identity, not contributor spec. Their anatomy (a contributor guide *about* the blocks, distinct from the blocks themselves) is documented in `docs/structural-specs.md`.

## Progressive Disclosure

- Keep this file focused on high-risk decisions and commands needed before search.
- Do not mirror long protocol descriptions, utility-skill internals, CI workflow details, or full architecture trees here when a linked source is authoritative.
- Use `README.md`, `docs/`, `.claude/rules/`, `.claude/principles/`, `.claude/skills/verify/`, and per-skill `SKILL.md` files as the next layer of detail.
- When adding guidance, first ask whether `rg`, `find`, or a linked doc would recover it cheaply at the point of need. If yes, add a pointer rather than copying the content.

## Design Placement

- `.claude/rules/` is for principles that must be active at per-turn runtime.
- `.claude/principles/` is for lazy-loaded architectural principles.
- `docs/analysis/` is for grounded exposition and investigation writeups.
- `docs/structural-specs.md` is for editing conventions and structural requirements.
- New rule proposals require a placement judgment against the existing docs/rules surface; do not add a runtime rule just because a concept is philosophically attractive.

## Development

- Node.js 22+ is required; CI pins Node 22.
- Plugin code uses Node.js standard library only. The landing page under `src/` is an independent React/Vite/Tailwind sub-project with its own `package.json`.
- Static checks: `node .claude/skills/verify/scripts/static-checks.js .`
- Tests: `node --test scripts/package.test.js anamnesis/scripts/hypomnesis-write.test.mjs`
- Packaging: `node scripts/package.js [--dry-run]`
- Changelog: `node scripts/generate-changelog.js`
- Installer: `scripts/install.sh`; `README.md` is the source of truth for the install set.

## Verification

Run `/verify` before commits. The decisive static verification command is:

```bash
node .claude/skills/verify/scripts/static-checks.js .
```

Do not run `scripts/package.test.js` concurrently with static protocol verification when liveness tests may mutate live `SKILL.md` files.

After protocol predicate refactors, run a lexical sweep for stale vocabulary using the verification guidance rather than hardcoding predicate inventories here.

Details: `docs/verification.md`.

## Editing Conventions

- Git and editing rules are auto-loaded via `.claude/rules/editing-conventions.md`.
- Any protocol change requires the relevant `plugin.json` version bump plus `/verify`.
- Co-change patterns are tracked in `docs/co-change.md`.
- When editing protocol prose, prefer positive predicates over negated anchoring, preserve composability while making morphism completion explicit, and verify the runtime contract view rather than source prose alone.
- For protocol edits, run a semantic-closure sweep whenever changing terminal conditions, state transitions, or result types. Align TYPES, PHASE TRANSITIONS, LOOP, CONVERGENCE, TOOL GROUNDING, and Rules so every new condition has a type, guard, state update, termination path, and result equation. Static checks do not prove this; manually verify before commit.

## Delegation Notes

Protocol-specific delegation notes belong in the relevant `SKILL.md`. Actual subagent use remains subordinate to the active runtime/tool policy and requires explicit user authorization when that policy requires it.
