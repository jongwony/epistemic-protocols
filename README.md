# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch misalignment early — often at the plan level, before it hardens into code or other downstream work. Fix the direction before the implementation compounds it.

## Why

Correcting a wrong direction at the plan level can cost one conversation turn.
Once it hardens into code, rollout steps, or downstream explanations, it can cost hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, execution, applicability, recall, and comprehension — so you and AI can surface, judge, and adapt misalignment before it compounds.

## Mission and Machinery

**Stated Mission** — the public hook: catch wrong directions early, especially at the plan level. This is the clearest entry story and how most users reach for the protocols.

**Realized Machinery** — the actual coverage: structured checkpoints span planning, analysis, decision, execution, verification, recall, and comprehension. Protocols such as Prosoche (execution guardrail compilation), Epharmoge (post-execution applicability), Anamnesis (session recall), and Katalepsis (comprehension verification) extend beyond plan-level alone.

The two layers serve different audiences: README and landing copy carry the narrow public contract; `SKILL.md` and `CLAUDE.md` describe the full machinery. See [docs/mission-bridge.md](./docs/mission-bridge.md) for the governance rules that keep these layers aligned.

## Quick Start

### Claude Code

Install all protocols and utilities:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

Then run `/onboard` — start with a quick recommendation based on your recent sessions, then optionally continue to guided learning with scenarios, trials, and quizzes.

### Codex

This repository is also a Codex plugin marketplace. To add it from GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash
```

For local development from a checkout:

```bash
codex plugin marketplace add /path/to/epistemic-protocols
```

The Codex marketplace preserves the same plugin boundaries as Claude Code: each protocol is its own plugin, and `epistemic-cooperative` carries the utility skills. Start with `onboard` for a quick recommendation, or add the local checkout when you are developing protocol changes.

<details>
<summary>Notes</summary>

- The Codex marketplace lives at [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json).
- Each plugin keeps its Codex manifest beside the existing Claude manifest: `<plugin>/.codex-plugin/plugin.json`.
- The marketplace includes the 15 protocol plugins plus `epistemic-cooperative`.

</details>

### Other agent tools

Protocol skill sources live in each plugin directory under `<plugin>/skills/<name>/SKILL.md`. The repository does not ship a pre-materialized `.agents/skills/` symlink view because Codex marketplace discovery can scan both plugin manifests and Agent Skills symlinks, producing duplicate skill entries.

Hosts that need an [Agent Skills](https://agentskills.io/specification)-style view should materialize it outside the Codex marketplace checkout or use host-specific packaging. Runtime *tool grounding* still varies by tool, so protocol behavior in non-Claude-Code hosts is provisional pending accumulated cross-host use evidence.

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Aitesis](./aitesis) | `/inquire` | AI charges ahead without asking what it needs to know |
| [Euporia](./euporia) | `/elicit` | You have intent but the outcome isn't clear — surface it through inductive dialogue |
| [Prothesis](./prothesis) | `/frame` | Need to look at this from multiple angles, not sure which |
| [Analogia](./analogia) | `/ground` | AI's advice sounds right in theory but unclear in your context |
| [Periagoge](./periagoge) | `/induce` | Multiple concrete cases accumulating into an unnamed essence — crystallize the emerging abstraction |
| [Syneidesis](./syneidesis) | `/gap` | About to commit but might be missing something |
| [Prosoche](./prosoche) | `/attend` | About to hand work to an autonomous run — compile its boundaries into verifiable goal conditions first |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Elenchus](./elenchus) | `/sublate` | About to externalize a working context that may have decayed — vet it dialectically first |
| [Horismos](./horismos) | `/bound` | You need to define what you know vs what AI should figure out |
| [Anamnesis](./anamnesis) | `/recollect` | You vaguely remember something was discussed before but cannot name it |
| [Anagoge](./anagoge) | `/ascend` | You vaguely remember a whole line of work, topic, or concept spread across many sessions — not any one session |
| [Diylisis](./diylisis) | `/distill` | You're handing a working context to a fresh session that shares none of it — distill out the session-tethered references first |
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need a fast path to understand, approve, explain, or modify them |
| [Hyphegesis](./hyphegesis) | `/conduct` | Multiple cognitive moves whose order, independence, reconciliation, stopping (termination), and routing aren't obvious — conduct how the whole session's work runs before starting |

Concern clusters: Planning (`/inquire`, `/elicit`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/ascend`, `/distill`, `/grasp`, `/conduct`)

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/probe`, `/catalog`, `/report`, `/dashboard`, `/write`, `/steer`, `/realign`, `/misuse`, `/triage`, `/dispatch`, `/forge`, `/reduced-space-test` | Protocol learning, deficit recognition fit review, handbook reference, usage analysis, coverage dashboard, multi-perspective blog drafting, project profile recalibration, project guide direction-line fusion, retrospective contract violation detection, work-unit triage, focused work-unit dispatch with PR fanout + rejection-trace inscription, reference-grounded initial-prompt formation, and scoped empirical validation |

**Three discovery modes coexist** (none replaces the others):

- `/catalog` — passive reference handbook (browse / lookup; you already know the question)
- `/onboard` — pattern-based recommendation + optional trial (session-history-driven; you want to learn what fits your patterns)
- `/probe` — active AI-hypothesized deficit recognition (multi-hypothesis fit review when you feel something is off but cannot yet name which deficit fits)

**Retrospective audit** (separate category from the discovery trio above):

- `/misuse` — retrospective contract violation scan (detects past `/ground` and `/induce` protocol violations; surfaces structured violation records for user-constituted review)

**Project guide direction-line fusion** (three-horizon Horizontverschmelzung):

- `/realign` — surface three horizons (the project guide's currently inscribed direction line, externally surfaced direction signals from a configured channel set, and the user's present pre-understanding elicited as a separate sub-step), compose a fusion candidate with a per-horizon transformation trace marking what was preserved / transformed / dropped in each horizon, shape the candidate through the dialectical widen / narrow / fuse / reorient / confirm / dismiss vocabulary inherited from `/induce`, and on user confirmation write the fused line back to the project guide direction line (rollback through the project's version control)

**Work-unit triage and dispatch**:

- `/triage` — read a scoped GitHub `RawIssueSet`, group related issues, normalize each group into a problem frame, fuse it with the `AGENTS.md` northstar in the current session, and emit dispatchable initial prompts with route choices
- `/dispatch` — consume focused work units or initial prompts, set an execution topology contract (composes `/bound`), verify each unit's premise, fan out work-unit branches/PRs, then load review feedback and inscribe rejection traces into linked issues so the next fresh-context session can re-enter without re-deriving the rejection's reasoning

**Reference-grounded prompt formation**:

- `/forge` — read a target reference (vendor model prompt guide, Codex Goals spec), reverse-induce the user's under-determined intent into a modality-aware IR, ground it against the reference via canonical-external dynamic fetch with a staleness guard, and project a ready-to-use initial prompt for a follow-up session/tool; vendor-agnostic core + parameterized adapter seam (Higgsfield, codex-goals), with the cross-adapter abstraction held as a deliberately deferred colimit

**Scoped empirical validation**:

- `/reduced-space-test` — decompose a target↔surrogate equivalence claim into verifiable facets, bound a user-synchronized stand-in test space with its residual complement (composes `/bound`), capture evidence inside it (composes `/inquire`), and carry the uncovered complement forward; an orchestration utility that scopes the resulting claim to the tested conditions rather than asserting absolute equivalence, with no new protocol or graph node

## Design

Each protocol targets a specific decision point where human-AI collaboration can drift. Public docs lead with the plan-level hook because it is the clearest entry story; contributor docs explain the broader machinery spanning planning, execution, verification, recall, and comprehension. For the bridge between those layers, see [docs/mission-bridge.md](./docs/mission-bridge.md). For architecture details and design philosophy, see [CLAUDE.md](./CLAUDE.md).

## For Contributors

New to the repo? Start with [ONBOARDING.md](./ONBOARDING.md). The intended usage: paste it into a fresh Claude Code session — the file carries an embedded instruction block that turns Claude into an onboarding buddy. Claude checks your environment against the setup checklist, routes you to the protocol that best matches your current stance, walks you through the core docs in order, and surfaces the contribution workflow and conventions.

Entry-point routing happens up front, so you can experience the protocols while onboarding onto them:

- **First encounter, no prior context** → `/onboard` (epistemic-cooperative) for a quick recommendation plus scenario/trial/quiz walkthrough
- **Want comprehension of the project itself verified** → `/grasp` (katalepsis) over `CLAUDE.md` or a specific `SKILL.md`
- **Already have a personal Claude Code workflow and want this project mapped onto it** → `/ground` (analogia), with your existing usage as the concrete domain
- **Need a fast when-to-use-which reference** → `/catalog` (epistemic-cooperative)

For the architecture and principles behind the protocols themselves, read [CLAUDE.md](./CLAUDE.md) and the axiom files under [`.claude/rules/`](./.claude/rules/).

<details>
<summary>Greek Codex</summary>

| Protocol | Greek | Meaning |
|----------|-------|---------|
| Prothesis | πρόθεσις | Setting forth |
| Syneidesis | συνείδησις | Shared knowing |
| Katalepsis | κατάληψις | Grasping, comprehension |
| Horismos | ὁρισμός | A bounding |
| Aitesis | αἴτησις | Request, inquiry |
| Analogia | ἀναλογία | Proportion |
| Periagoge | περιαγωγή | Turning-around |
| Euporia | εὐπορία | Way through, resourcefulness |
| Prosoche | προσοχή | Attention |
| Epharmoge | ἐφαρμογή | Application, fitting |
| Elenchus | ἔλεγχος | Cross-examination, refutation |
| Anamnesis | ἀνάμνησις | Recollection |
| Anagoge | ἀναγωγή | A leading-up |
| Diylisis | διύλισις | Refining, distillation |
| Hyphegesis | ὑφήγησις | Leading the way, guiding from ahead |

</details>

## Acknowledgments

- [@yolohyo](https://github.com/yolohyo) — Comment-lifecycle UX design contribution for comment-review
- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution for Onboard

## License

MIT
