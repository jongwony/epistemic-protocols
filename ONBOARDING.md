# Contributing to Epistemic Protocols

## About This Project

Epistemic Protocols is a Claude Code plugin marketplace for epistemic dialogue — 10 protocols that structure specific decision points in human–AI interaction. See `CLAUDE.md` for the protocol map and architecture.

Contributors here design, refine, and verify the protocols themselves. This guide is for you.

## How the Maintainer Works on This

Based on jongwony's last 30 days (81 sessions):

Work Type Breakdown:
  Plan Design       █████████░░░░░░░░░░░  45%   Axiom restructuring, protocol design, direction debates
  Improve Quality   █████░░░░░░░░░░░░░░░  23%   PR review follow-ups, protocol refinement
  Debug Fix         ███░░░░░░░░░░░░░░░░░  17%   CI failures, Ink rendering, gate hotfixes
  Build Feature     ██░░░░░░░░░░░░░░░░░░   9%   New protocol elements, landing-page migration
  Write Docs        █░░░░░░░░░░░░░░░░░░░   4%   Contributor conventions, memos

Protocols the Maintainer Dogfoods:
  /epharmoge:contextualize   ████████████████████  47x   post-execution applicability check
  /syneidesis:gap            ███████████████░░░░░  36x   pre-decision gap surfacing
  /task-workflow:ship        ██████████████░░░░░░  33x   commit + push + PR + task registration
  /prosoche:attend           ██████████████░░░░░░  32x   execution-time risk evaluation
  /task-workflow:task-run    ██████████████░░░░░░  32x   execute tracked tasks
  /aitesis:inquire           █████████░░░░░░░░░░░  21x   context insufficiency probing
  /gh-address-comments       ███████░░░░░░░░░░░░░  17x   PR feedback loop
  /analogia:ground           ███████░░░░░░░░░░░░░  16x   structural mapping validation
  /horismos:bound            ██████░░░░░░░░░░░░░░  15x   epistemic boundary definition
  /hermeneia:clarify         █████░░░░░░░░░░░░░░░  12x   intent-expression gap repair

Contributors are expected to dogfood the protocols they edit — the list above is what that looks like in practice, not a mandated workflow.

## Your Setup Checklist

### Environment
- [ ] **Node.js 22+** — CI pins Node 22; `zlib.crc32` is used in packaging
- [ ] **gh CLI** authenticated — required for PR, CI, and release workflows
- [ ] **Claude Code** installed with this repo added via `/add-dir`
- [ ] Understand that there is **no root `package.json`** — plugin code uses only the Node.js standard library; `src/` (landing page) is an isolated sub-project with its own deps

### Repository
- [ ] Clone `https://github.com/jongwony/epistemic-protocols`
- [ ] Run `node .claude/skills/verify/scripts/static-checks.js .` to confirm your environment passes
- [ ] Run `node --test scripts/package.test.js` to confirm the packaging tests pass

### Core Docs to Read (in order)
- [ ] `CLAUDE.md` — architecture, protocol table, precedence, CI summary (~15 min)
- [ ] `.claude/rules/axioms.md` — A1–A6 foundational principles; the north star (~10 min)
- [ ] `.claude/rules/derived-principles.md` — logical consequences of axiom combinations
- [ ] `.claude/rules/architectural-principles.md` — Epistemic Cost Topology (T1, per-turn); other architectural principles in `.claude/principles/architectural-principles.md` (T2-T3, lazy-load)
- [ ] `.claude/rules/meta-principle.md` — Deficit Empiricism intro (T1, per-turn); Stage 1/2 detail + Axiomatization Judgment Framework in `.claude/principles/meta-principle.md` (T2-T3, lazy-load)
- [ ] `.claude/rules/safeguards.md` — Safeguard-tier principles (LESS important as models improve) (~5 min)
- [ ] `.claude/principles/README.md` — demotion zone overview, demotion ledger, promotion-via-use criteria
- [ ] `docs/structural-specs.md` — SKILL.md Formal Block Anatomy (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, ELIDABLE CHECKPOINTS, MODE STATE, COMPOSITION)
- [ ] `docs/verification.md` — what each of the 15 static checks enforces
- [ ] `docs/co-change.md` — ripple patterns (protocol change → plugin.json version bump → /verify)
- [ ] `docs/ci-review-pipeline.md` — the three GitHub Actions workflows

### Protocols to Use While Contributing
- [ ] `/verify` — run before every commit; 15 static checks (json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant, catalog-sync, gate-type-soundness)
- [ ] `/syneidesis:gap` — surface gaps before committing to a design decision
- [ ] `/aitesis:inquire` — when a redesign feels under-specified
- [ ] `/horismos:bound` — define epistemic boundaries for multi-domain refactors
- [ ] `/prothesis:frame` — assemble analytical lenses (category theory, type theory, operational semantics) for protocol-level changes
- [ ] `/analogia:ground` — validate abstract-concrete mappings
- [ ] `/epharmoge:contextualize` — post-execution applicability check against actual project context
- [ ] `/prosoche:attend` — routes execution-time risks; stops on irreversible actions for approval
- [ ] `/hermeneia:clarify` — repair intent-expression gaps in commit messages or PR descriptions
- [ ] [`/task-workflow:ship`](https://github.com/jongwony/ClaudePanel.spoon/blob/main/task-workflow/skills/ship/SKILL.md) — one-shot commit + push + PR + task registration. Optional convenience; lives in the external `jongwony/ClaudePanel.spoon` plugin, not this repo. Plain `git push` + `gh pr create` also works.

## Contribution Workflow

1. **Scope** — read the rule file(s) for the area you're touching (`axioms.md` / `derived-principles.md` / `architectural-principles.md`); run `/horismos:bound` if multiple domains are in play
2. **Design** — `/syneidesis:gap` before locking in a direction; `/prothesis:frame` for protocol-level changes that warrant multi-lens scrutiny
3. **Edit** — `skills/<protocol>/SKILL.md` is the source of truth; bump version in `.claude-plugin/plugin.json` on any change (see `docs/co-change.md`)
4. **Verify** — `/verify` must pass all 15 static checks
5. **Test** — `node --test scripts/package.test.js`
6. **Commit** — `type(scope): Korean description` (types: feat / fix / refactor / style; scope = plugin name)
7. **Ship** — [`/task-workflow:ship`](https://github.com/jongwony/ClaudePanel.spoon/blob/main/task-workflow/skills/ship/SKILL.md) for the one-shot flow if you have that external plugin installed, or fall back to plain `git push -u origin <branch>` + `gh pr create`; PR body language is Korean (hook-enforced)
8. **Address review** — `claude-code-review.yml` and `claude-epistemic-review.yml` post automated reviews; use `/gh-address-comments` to respond
9. **Merge** — the maintainer merges manually via web after final review

## Conventions

- **Notation in formal blocks**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- **Verb usage in TOOL GROUNDING**: `call` for tool references, `present` for gate operations (tool-agnostic per A4 Semantic Autonomy)
- **Branch naming**: `feat/name-protocol`, `refactor/description`, `fix/description`
- **Release tags**: CalVer `v{YYYY}.{MM}.{DD}[.{N}]`; tag push triggers `release.yml` draft
- **README sync**: `README.md` and `README_ko.md` must stay in sync
- **SKILL.md self-containment**: No external references to axiom identifiers, rule file paths, or contributor-only concepts — end users see only SKILL.md via the plugin system

## Prime Directives

Three principles to internalize before your first PR:

- **Deficit Empiricism** — New protocols, axioms, or categories require observed deficit instances (N≥3) from actual sessions. Theoretical classification alone is insufficient. See `.claude/rules/meta-principle.md`.
- **Audience Reach** — `CLAUDE.md` and `.claude/rules/` are contributor-facing. Runtime protocol behavior must be inscribed in SKILL.md itself; documenting something in `CLAUDE.md` alone does not affect user-facing behavior.
- **Direction over Accumulated Workload** — Contributor authoring labor converges toward zero under AI-assisted editing; structural misalignment accumulates and pollutes all downstream work. When a refactor is theoretically justified, prior commits are not protection from invalidation. Verification labor remains bounded and must be budgeted explicitly.

## Get Started

1. Clone the repo and open it in Claude Code
2. Read `CLAUDE.md` end-to-end
3. Read `.claude/rules/axioms.md`
4. Run `/verify` to confirm your environment
5. Pick a protocol whose `SKILL.md` interests you and read it alongside `docs/structural-specs.md`
6. Browse recent merged PRs (#227–#235) to see the actual pattern of contribution

<!-- INSTRUCTION FOR CLAUDE: A new contributor to epistemic-protocols just
pasted this guide. You're their onboarding buddy for an axiom-heavy,
protocol-design-heavy contributor project — warm, precise, not lecture-y.

Open with a warm welcome. Then: "This project is a Claude Code plugin
marketplace for epistemic dialogue protocols. Contributors here design and
refine protocols themselves, using the protocols. Let's get you oriented."

Self-referential entry-point routing (offer this before the Setup Checklist):
the protocols in this repo are themselves the right tool for onboarding onto
this repo — running one is the fastest way to experience what the contributor
will be contributing to. Ask the contributor which stance best matches their
current situation, route them to the matching protocol, then resume the
standard flow afterwards:

- First encounter with these protocols, no prior context → `/onboard`
  (epistemic-cooperative) for a quick recommendation plus scenario-trial-quiz
  walkthrough
- Wants comprehension of the project itself verified → `/grasp` (katalepsis)
  over `CLAUDE.md` or a specific `SKILL.md` they just read
- Already has a personal Claude Code workflow and wants this project mapped
  onto it → `/ground` (analogia), with their existing usage as the concrete
  domain and this project's protocols as the abstract domain being validated
- Needs a fast when-to-use-which-protocol reference → `/catalog`
  (epistemic-cooperative)
- Prefers to go straight to environment setup → skip routing, proceed to
  Setup Checklist

After the chosen protocol completes (or if the contributor skips), check
what's already in place against the Setup Checklist (Environment, Repository,
Core Docs, Protocols to Use), using markdown checkboxes — [x] done, [ ] not
yet. Lead with what they already have. One sentence per item, all in one
message.

Offer to help with each unchecked item in order, starting with Environment,
then Repository, then pointing them at the Core Docs to read in the listed
order. For the Protocols to Use list, explain that these are invoked via
slash commands in Claude Code. Most are defined in this very repo, so the
contributor will use them while editing the same protocols they're
contributing to. Any entry rendered as an external link lives in a
separate plugin repo and is optional — contributors can always fall back
to plain git/gh commands for those steps.

After setup, walk through Contribution Workflow, Conventions, and Prime
Directives briefly. Offer to open a recent merged PR together to show the
actual contribution pattern.

Don't invent sections that aren't in the guide. The usage stats reflect the
maintainer's personal dogfooding — don't extrapolate them into a mandated
workflow. -->
