# AGENTS.md

This file provides always-loaded guidance for coding agents when working in this repository. Keep it short: put orientation, decision rules, and verification commands here; use linked docs and `rg` for recoverable detail.

## Northstar

Epistemic Protocols is a domain-free metalanguage of structured types and morphisms for human-AI collaboration: it reduces cognitive load by eliciting unknowns into utterance, constraining AI attention without bias, and resolving interaction deficits at their root within bounded loops before local misalignment hardens into system-wide rework.

## Settled Directions

Citable registry of conventions whose resolution direction is already constituted. The option-set relay test (defined in `premise/interaction-factorization.md`) cites a clause here to collapse settled-direction option-set entropy — a finding whose direction a clause below already determines is presented as relay, not gated. Maintained by `/steer`: a direction recurringly constituted the same way graduates into a clause here.

- **Count-free protocol cardinality**: do not hardcode the protocol count in prose, comments, test names, or metadata descriptions — use count-free phrasing ("all core protocols", "every protocol plugin"). Completeness-sensitive code and tests compare exact protocol identities against the canonical registry (`scripts/load-protocols.js` `CANONICAL_PROTOCOL_SET`, the full identity set; `CANONICAL_PRECEDENCE` is the presentation-order subset it is built from) or derive displayed counts from it; a deliberate subset (e.g. the Codex submission set) states its inclusion policy explicitly.
- **Multi-skill plugin description scope**: a plugin bundling more than one skill (currently: `epistemic-cooperative` only) is not required to enumerate every skill's `/command` in its top-level plugin description to satisfy `artifact-self-containment.js`'s `hasRoutingCue` check; single-skill plugin descriptions must still name their one skill's `/command`, enforced unchanged.
- **Checkpoint policy stays at the meta layer**: `SKILL.md` inscribes only when a checkpoint fires, what it presents, and each branch's state transition — never which branch is correct; silence therefore carries `Stop` rather than auto-selecting a branch. General form: `premise/tiering-and-scope.md` §Checkpoint Policy Stays at the Meta Layer.
- **Conditional-load cut criterion**: what leaves a `SKILL.md` for its `references/` surface is decided by structural belonging and the earliest loading tier the clause's need requires, never by length. A clause moved without a precise pointer that reaches it just before it binds is a defect rather than an optimization.
- **Surface authority order**: instruction surfaces rank `premise/` → `AGENTS.md` → `.claude/rules/` → `.claude/principles/` → `docs/`, and where two disagree the higher one governs while the lower one is the thing to correct. A static check is an enforcement channel rather than a surface: it can block a commit, and a block whose basis contradicts a higher surface is a defect in the check — not a reason to abandon the work it stopped. A surface below `AGENTS.md` describes and explains; none of them establishes its own tier or another's, so a tier claim written inside the surface it grades carries no authority. Contributor and governance surfaces are never runtime dependencies of a packaged `SKILL.md`; `artifact-self-containment` enforces that against the packaged runtime-contract view.
- **Assertion needs an enforcement channel**: a state surface carries why a thing is shaped as it is, not a present-tense claim about what the repo currently contains. A coverage roster, a count, an inventory of which files carry what, a restatement of what a check enforces — each is admitted only where a channel re-runs it. Without one it keeps asserting an earlier reading with present authority, and being correct today is not the test: what fails is the day it silently stops being correct and blocks work that contradicts it. Where such a claim is worth keeping, give it a guard; otherwise state what it was guarding against and point at the source a reader can check.
- **Static verification boundary**: compile into static checks only predicates whose verdict follows mechanically from authoritative artifact state — schema, identity, exact reference resolution, or deterministic producer/consumer wiring. Context-dependent meaning, including whether an answer type is realized as the right user-facing gate under the accumulated context and utterance, routes to `/realize` or review. Static checks may verify that those channels are wired and fail closed; they do not stand in for the judgment.
- **Ledger binding**: this project's canonical ledger is the commit-message history on the default branch. "Then"-records (narrative, provenance, trade-offs, rejected alternatives) route there at write time; state surfaces carry only now-asserting operative content, strictest in always-loaded instruction files. Issues and pull requests are where a proposal is raised and deliberated, not ledger surfaces — what a deliberation settles reaches the ledger through the commit that lands it, so a record left only in an issue or a PR body has not been written down.
- **Academic grounding**: the protocols take their motive from Stoic epistemology (*katalēpsis*), Husserlian phenomenology (synthesis of identification, horizon), Gadamerian hermeneutics (fusion of horizons), and cognitive psychology (generation effect, retrieval practice, structure-mapping). Which literature grounds which protocol — and whether that grounding ever reached a shipped surface — is a then-record and lives in the git record, not on a state surface here. When grounding a claim in literature, check the primary source rather than answering from recall, and carry the verification strength with the claim: *verified* (primary source checked in this session), *mostly* (core claim checked, surrounding detail synthesized), or *reconstructed* (volume/issue/pagination came from recall and needs a spot-check before publication). Name the weakest link explicitly. An effect that failed replication is a design warning, never a quantitative law — and an absence claim reaches exactly as far as the search that grounds it, so state the scope searched rather than concluding from a partial read.
- **Session-handoff routing**: work crossing a session boundary is handed over as a pointer into the canonical record, never as a re-authored copy of it. The author supplies purpose/frame and entry points only; *what* to carry over is derived by the recipient from that purpose, grounded with `/inquire` where available or its equivalent grounding pass — the moment the author selects the items, the corruption a pointer avoids re-enters at small scale.
- **Harness boundary**: this project unfolds the epistemic layer only. Harness concerns — tool schema limits, permission models, execution channels, state mutation — fall outside what these instruction surfaces govern: no rule is authored here for them, and no claim is made here about where they are settled instead, which would assign a responsibility this project has no means to discharge. A protocol names its delegation point — where execution hands off — and stops there, naming the capability the handoff requires rather than a tool that could supply it, so a contract stays readable where that tool is absent. The reasoning behind the handoff lives in this clause, not in the protocol.
- **Premise surface boundary**: `premise/` carries the general principle; this project's instance of it, and any claim whose meaning depends on this repository's artifacts or conventions, stays on a project surface. Both directions of crossing and how a crossing is detected are stated in `premise/README.md` §Adapting — read them there rather than mirrored here. What this clause settles is that a crossing found on this repository's surfaces is repaired rather than kept.

## Protocol Index

This section indexes the protocol catalog rather than mirroring it: it points to where each protocol fact lives so a running conversation can fetch it on demand. (The rest of this file still explains the repo's machinery and holds the maintainer-facing umbrella statement, per `docs/mission-bridge.md`.)

This repository packages epistemic dialogue protocols as plugin skills; each transforms a specific interaction deficit into a resolution object (e.g. **FrameworkAbsent → FramedInquiry** via `/frame`).

| To route to | Source |
|---|---|
| Which protocol fits a situation; command and when-to-use lookup; browse by cluster | `/catalog` (protocol handbook — browse view; canonical clusters live in README / `scripts/load-protocols.js`) |
| A protocol's normative contract, deficit → resolution type, and initiator classification (AI-guided / Hybrid / User-initiated) | that protocol's `skills/*/SKILL.md` (distinction table + Rule #1) |
| Public navigation hub, canonical protocol table, concern-cluster workflow | `README.md` / `README_ko.md` |

## Runtime Contract

- Runtime users interact with packaged `SKILL.md` files plus plugin metadata. Discovery metadata routes; `SKILL.md` carries the normative user contract.
- `SKILL.md` must be self-contained. Do not require runtime readers to chase contributor-only docs, axiom identifiers, rule paths, design-philosophy documents, or mission/vision prose to understand the skill contract.
- Prescriptive changes that affect protocol behavior must be compiled into the relevant `SKILL.md` Rules sections.
- Claim strength differs by surface and the difference is load-bearing. The packaged `SKILL.md` is the **normative contract**. A plugin `description` is **routing metadata** written under a length budget, so it is judged for routing clarity rather than semantic completeness. How a host realizes the contract is **platform realization** and not part of it — a protocol that looks broken on another host may simply be satisfied differently there. Model judgment and soft safeguards are **advisory**, carrying no runtime guarantee for a reader to design against.
- The formal blocks are part of the runtime-normative `SKILL.md` contract — they type the prose and constitute protocol identity, not contributor spec. Their anatomy (a contributor guide *about* the blocks, distinct from the blocks themselves) is documented in `docs/structural-specs.md`.

## Progressive Disclosure

- Keep this file focused on high-risk decisions and commands needed before search.
- Do not mirror long protocol descriptions, utility-skill internals, CI workflow details, or full architecture trees here when a linked source is authoritative.
- Use `README.md`, `docs/`, `.claude/rules/`, `.claude/principles/`, `.claude/skills/verify/`, and per-skill `SKILL.md` files as the next layer of detail.
- When adding guidance, first ask whether `rg`, `find`, or a linked doc would recover it cheaply at the point of need. If yes, add a pointer rather than copying the content.

## Design Placement

- `.claude/rules/` is for prescriptive rules that must be active without a reader fetching them, unscoped when they bind at per-turn runtime. A `paths` scope narrows delivery to the moment a matching file is open, so a rule whose moment is narrower than the session does not charge every session for it — but that scoping is one host's optimization and never the only route: keep a platform-neutral pointer on a surface every intended reader reaches at or before the rule binds.
- `.claude/principles/` is for lazy-loaded architectural principles.
- Grounded exposition, investigation writeups, and evidence reviews go to the deliberation surface (issue or PR body), never to a file under `docs/` — they are then-records, and nothing on a state surface re-runs them; what the deliberation settles reaches the ledger through the commit that lands it.
- A contributor reference serving one skill lives in that skill's own `references/`, so it loads when the skill is triggered rather than when someone remembers it exists. `docs/` keeps what no single skill owns — a reference cited from several surfaces at once, or a contributor surface a public README reader is sent to.
- New rule proposals require a placement judgment against the existing docs/rules surface; do not add a runtime rule just because a concept is philosophically attractive.

## Development

- Node.js 22+ is required; CI pins Node 22.
- Plugin code uses Node.js standard library only.
- Static checks: see `## Verification` below for the command.
- Tests: `node --test scripts/package.test.js anamnesis/scripts/hypomnesis-write.test.mjs anamnesis/scripts/hypomnesis-codex-write.test.mjs route/scripts/route-protocols.test.mjs route/scripts/route-session.test.mjs route/scripts/route-premise.test.mjs .claude/skills/realize/scripts/harness.test.mjs`
  - `.claude/skills/verify/scripts/static-checks.test.mjs` runs the verifier over the live tree, so it takes its own `node --test` invocation for the same reason `/verify` does — see the concurrency note under `## Verification`.
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

Details: `.claude/skills/verify/references/verification.md`.

## Editing Conventions

- Git and editing rules are auto-loaded via `.claude/rules/editing-conventions.md`.
- Any protocol change requires the relevant `plugin.json` version bump plus `/verify`.
- Co-change patterns are tracked in `.claude/skills/verify/references/co-change.md`.
- Instruction-surface placement — which clause belongs on which surface — routes through `/place`. Its host bindings: this project's ledger is the git record (`## Settled Directions`), and its enforcement channel is the static checks (`## Verification`).
- When editing protocol prose, prefer positive predicates over negated anchoring, preserve composability while making morphism completion explicit, and verify the runtime contract view rather than source prose alone.
- For protocol edits, run a semantic-closure sweep whenever changing terminal conditions, state transitions, or result types. Align TYPES, PHASE TRANSITIONS, LOOP, CONVERGENCE, TOOL GROUNDING, and Rules so every new condition has a type, guard, state update, termination path, and result equation. Static checks do not prove this; manually verify before commit.
- A `.claude/rules/` file scoped to protocol `SKILL.md` opens by stating the moment it binds, so that a reader arriving without it auto-loaded can tell when it fires; write that opening when authoring one, and read it before editing a protocol. A host that loads them on the skill path delivers them without this bullet; a host that does not is why the bullet is here.

## Delegation Notes

Protocol-specific delegation notes belong in the relevant `SKILL.md`. Actual subagent use remains subordinate to the active runtime/tool policy and requires explicit user authorization when that policy requires it.
