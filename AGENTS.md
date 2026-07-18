# AGENTS.md

This file provides always-loaded guidance for coding agents when working in this repository. Keep it short: put orientation, decision rules, and verification commands here; use linked docs and `rg` for recoverable detail.

## Northstar

Epistemic Protocols is a domain-free metalanguage of structured types and morphisms for human-AI collaboration: it reduces cognitive load by eliciting unknowns into utterance, constraining AI attention without bias, and resolving interaction deficits at their root within bounded loops before local misalignment hardens into system-wide rework.

## Settled Directions

Citable registry of conventions whose resolution direction is already constituted. The option-set relay test (in `.claude/rules/axioms.md`) cites a clause here to collapse settled-direction option-set entropy — a finding whose direction a clause below already determines is presented as relay, not gated. Maintained by `/steer`: a direction recurringly constituted the same way graduates into a clause here.

- Mechanism pointer: the consuming mechanism (the option-set relay test) is defined in `.claude/rules/axioms.md` §A5 — not restated here.
- **Count-free protocol cardinality**: do not hardcode the protocol count in prose, comments, test names, or metadata descriptions — use count-free phrasing ("all core protocols", "every protocol plugin"). Completeness-sensitive code and tests compare exact protocol identities against the canonical registry (`scripts/load-protocols.js` `CANONICAL_PRECEDENCE`) or derive displayed counts from it; a deliberate subset (e.g. the Codex submission set) states its inclusion policy explicitly.
- **Multi-skill plugin description scope**: a plugin bundling more than one skill (currently: `epistemic-cooperative` only) is not required to enumerate every skill's `/command` in its top-level plugin description to satisfy `artifact-self-containment.js`'s `hasRoutingCue` check; single-skill plugin descriptions must still name their one skill's `/command`, enforced unchanged.

## Protocol Index

This section indexes the protocol catalog rather than mirroring it: it points to where each protocol fact lives so a running conversation can fetch it on demand. (The rest of this file still explains the repo's machinery and holds the maintainer-facing umbrella statement, per `docs/mission-bridge.md`.)

This repository packages epistemic dialogue protocols as plugin skills; each transforms a specific interaction deficit into a resolution object (e.g. **FrameworkAbsent → FramedInquiry** via `/frame`).

| To route to | Source |
|---|---|
| Which protocol fits a situation; command and when-to-use lookup; browse by cluster | `/catalog` (protocol handbook — browse view; canonical clusters live in README / `scripts/load-protocols.js`) |
| Authoritative dependency graph — nodes and `precondition` / `advisory` / `suppression` edges | `.claude/skills/verify/graph.json` |
| A protocol's normative contract, deficit → resolution type, and initiator classification (AI-guided / Hybrid / User-initiated) | that protocol's `skills/*/SKILL.md` (distinction table + Rule #1) |
| Public navigation hub, canonical protocol table, concern-cluster workflow | `README.md` / `README_ko.md` |

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
- Static checks: see `## Verification` below for the command.
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
