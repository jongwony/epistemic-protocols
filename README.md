# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch misalignment early — often at the plan level, before it hardens into code or other downstream work. Fix the direction before the implementation compounds it.

## Why

Correcting a wrong direction at the plan level can cost one conversation turn.
Once it hardens into code, rollout steps, or downstream explanations, it can cost hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, execution, applicability, recall, and comprehension — so you and AI can surface, judge, and adapt misalignment before it compounds.

## Mission and Machinery

**Stated Mission** — the public hook: catch wrong directions early, especially at the plan level. This is the clearest entry story and how most users reach for the protocols.

**Realized Machinery** — the actual coverage: structured checkpoints span planning, analysis, decision, execution, verification, recall, and comprehension. Protocols such as Prosoche (execution-time risk), Epharmoge (post-execution applicability), Anamnesis (session recall), and Katalepsis (comprehension verification) extend beyond plan-level alone.

The two layers serve different audiences: README and landing copy carry the narrow public contract; `SKILL.md` and `CLAUDE.md` describe the full machinery. See [docs/mission-bridge.md](./docs/mission-bridge.md) for the governance rules that keep these layers aligned.

## Quick Start

### Claude Code

Install all protocols and utilities:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

Then run `/onboard` — start with a quick recommendation based on your recent sessions, then optionally continue to guided learning with scenarios, trials, and quizzes.

### Codex

Paste in Codex and run:

```text
$skill-installer install these skills from jongwony/epistemic-protocols:
- prothesis/skills/frame
- syneidesis/skills/gap
- katalepsis/skills/grasp
- aitesis/skills/inquire
- horismos/skills/bound
- analogia/skills/ground
- periagoge/skills/induce
- euporia/skills/elicit
- prosoche/skills/attend
- epharmoge/skills/contextualize
- anamnesis/skills/recollect
- epistemic-cooperative/skills/onboard
```

Restart Codex, then start with `$onboard`.

<details>
<summary>Notes</summary>

- This installs 11 protocols + `onboard`. `/report`, `/dashboard`, `/write` are not included.
- To install a single skill, use the same `skill-installer` pattern with one path.
- This README is the source of truth for the Codex-supported install set.

</details>

### Other agent tools (Agent Skills standard)

Cursor, GitHub Copilot, Devin, OpenCode, Codex CLI, Gemini CLI, and others discover skills under `.agents/skills/<name>/SKILL.md` per the [Agent Skills specification](https://agentskills.io/specification). This repository ships a pre-materialized view of every protocol/utility skill at that path (relative symlinks back to the per-plugin source — no duplication). Cloning the repo is sufficient; no installer step is required.

To regenerate after adding/renaming skills:

```bash
scripts/sync-agents-symlinks.sh
```

The `agents-symlinks-sync` static check fails the pre-commit if the materialized view drifts from the plugin sources.

> Note: skill *discovery* via `.agents/skills/` is a verified cross-tool standard. Runtime *tool grounding* (host-specific tools referenced in `PHASE TRANSITIONS` / `TOOL GROUNDING` such as `Skill()`, `Task`, `AskUserQuestion`) varies by tool — protocol behavior in non-Claude-Code hosts is provisional pending accumulated cross-host use evidence.

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Aitesis](./aitesis) | `/inquire` | AI charges ahead without asking what it needs to know |
| [Euporia](./euporia) | `/elicit` | You have intent but the outcome isn't clear — surface it through inductive dialogue |
| [Prothesis](./prothesis) | `/frame` | Need to look at this from multiple angles, not sure which |
| [Analogia](./analogia) | `/ground` | AI's advice sounds right in theory but unclear in your context |
| [Periagoge](./periagoge) | `/induce` | Multiple concrete cases accumulating into an unnamed essence — crystallize the emerging abstraction |
| [Syneidesis](./syneidesis) | `/gap` | About to commit but might be missing something |
| [Prosoche](./prosoche) | `/attend` | Want execution readiness checked and risky actions gated for your judgment |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Horismos](./horismos) | `/bound` | You need to define what you know vs what AI should figure out |
| [Anamnesis](./anamnesis) | `/recollect` | You vaguely remember something was discussed before but cannot name it |
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need to actually understand them |

Concern clusters: Planning (`/inquire`, `/elicit`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`)

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/probe`, `/catalog`, `/report`, `/dashboard`, `/write`, `/steer`, `/realign`, `/misuse`, `/dispatch` | Protocol learning, deficit recognition fit review, handbook reference, usage analysis, coverage dashboard, multi-perspective blog drafting, project profile recalibration via session calibration drift audit, project guide direction line via three-horizon fusion, retrospective contract violation detection, and delegated parallel issue resolution with categorical decomposition + per-category PR + Wirkungsgeschichte feedback inscription |

**Three discovery modes coexist** (none replaces the others):

- `/catalog` — passive reference handbook (browse / lookup; you already know the question)
- `/onboard` — pattern-based recommendation + optional trial (session-history-driven; you want to learn what fits your patterns)
- `/probe` — active AI-hypothesized deficit recognition (multi-hypothesis fit review when you feel something is off but cannot yet name which deficit fits)

**Retrospective audit** (separate category from the discovery trio above):

- `/misuse` — retrospective contract violation scan (detects past `/ground` and `/induce` protocol violations; surfaces structured violation records for user-constituted review)

**Project guide direction-line fusion** (three-horizon Horizontverschmelzung):

- `/realign` — surface three horizons (the project guide's currently inscribed direction line, externally surfaced direction signals from a configured channel set, and the user's present pre-understanding elicited as a separate sub-step), compose a fusion candidate with a per-horizon transformation trace marking what was preserved / transformed / dropped in each horizon, shape the candidate through the dialectical widen / narrow / fuse / reorient / confirm / dismiss vocabulary inherited from `/induce`, and on user confirmation write the fused line back to the project guide direction line (rollback through the project's version control)

**Delegated parallel work** (multi-issue dispatch):

- `/dispatch` — set a minimal delegation contract (composes `/bound`), categorize open issues by project direction and accumulated review-feedback context, fan out per-category sub-branches with per-category PRs, then load review feedback and inscribe rejection traces into linked issues so the next fresh-context session can re-enter without re-deriving the rejection's reasoning

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
| Hermeneia | ἑρμηνεία | Interpretation |
| Katalepsis | κατάληψις | Grasping, comprehension |
| Telos | τέλος | End, purpose |
| Horismos | ὁρισμός | A bounding |
| Aitesis | αἴτησις | Request, inquiry |
| Analogia | ἀναλογία | Proportion |
| Periagoge | περιαγωγή | Turning-around |
| Euporia | εὐπορία | Way through, resourcefulness |
| Prosoche | προσοχή | Attention |
| Epharmoge | ἐφαρμογή | Application, fitting |
| Anamnesis | ἀνάμνησις | Recollection |

</details>

## Acknowledgments

- [@yolohyo](https://github.com/yolohyo) — Comment-lifecycle UX design contribution for comment-review
- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution for Onboard

## License

MIT
