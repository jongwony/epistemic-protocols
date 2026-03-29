# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch direction errors early — at the plan level, not the code level. Fix the direction, not the implementation.

## Why

Correcting a wrong direction at the plan level costs one conversation turn.
At the code level, it costs hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, execution — so you and AI stay aligned before committing to implementation.

## Quick Start

### Claude Code

Install all protocols and utilities:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

Then run `/onboard` — start with a quick recommendation based on your recent sessions, then optionally continue to guided learning with scenarios, trials, and quizzes.

### Codex

Open this repository in Codex, then open the plugin directory:

```bash
codex
/plugins
```

Install the plugins you want from the `Epistemic Protocols` marketplace, then invoke them with `$plugin:skill`.

Examples:

```text
$epistemic-cooperative:onboard
$hermeneia:clarify
$analogia:ground
```

<details>
<summary>Notes</summary>

- Codex reads the local marketplace from `.agents/plugins/marketplace.json`.
- Each Codex plugin points directly at the original source directory such as `./prothesis` or `./epistemic-cooperative`.
- The current Codex marketplace exposes 10 protocol plugins plus `epistemic-cooperative`, and also includes experimental `reflexion` and `write` entries.
- Claude and Codex now share the same source directories; only the plugin metadata entrypoints differ.

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
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need to actually understand them |

Concern clusters: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/grasp`)

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/report`, `/dashboard` | Protocol learning, usage analysis, and coverage dashboard |

For Codex, use the plugin-qualified form such as `$epistemic-cooperative:onboard`.

## Design

Each protocol targets a specific point where AI collaboration can go wrong. For architecture details and design philosophy, see [CLAUDE.md](./CLAUDE.md).

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
