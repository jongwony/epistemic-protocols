# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch misalignment early — often at the plan level, before it hardens into code or other downstream work. Fix the direction before the implementation compounds it.

## Why

Correcting a wrong direction at the plan level can cost one conversation turn.
Once it hardens into code, rollout steps, or downstream explanations, it can cost hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, execution, applicability, recall, and comprehension — so you and AI can surface, judge, and adapt misalignment before it compounds.

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
- hermeneia/skills/clarify
- katalepsis/skills/grasp
- telos/skills/goal
- aitesis/skills/inquire
- horismos/skills/bound
- analogia/skills/ground
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

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Hermeneia](./hermeneia) | `/clarify` | AI keeps building what you didn't ask for |
| [Telos](./telos) | `/goal` | You know you want something but can't define success |
| [Aitesis](./aitesis) | `/inquire` | AI charges ahead without asking what it needs to know |
| [Prothesis](./prothesis) | `/frame` | Need to look at this from multiple angles, not sure which |
| [Analogia](./analogia) | `/ground` | AI's advice sounds right in theory but unclear in your context |
| [Syneidesis](./syneidesis) | `/gap` | About to commit but might be missing something |
| [Prosoche](./prosoche) | `/attend` | Want execution readiness checked and risky actions gated for your judgment |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Horismos](./horismos) | `/bound` | You need to define what you know vs what AI should figure out |
| [Anamnesis](./anamnesis) | `/recollect` | You vaguely remember something was discussed before but cannot name it |
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need to actually understand them |

Concern clusters: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`)

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/report`, `/dashboard`, `/write` | Protocol learning, usage analysis, coverage dashboard, and multi-perspective blog drafting |

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
| Prosoche | προσοχή | Attention |
| Epharmoge | ἐφαρμογή | Application, fitting |

</details>

## Acknowledgments

- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution for Onboard

## License

MIT
