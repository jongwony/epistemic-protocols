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

Then run `/onboard` — learn protocols through hands-on experience: scenarios from your past sessions, real protocol trials, and Socratic quizzes.

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
- epistemic-cooperative/skills/onboard
```

Restart Codex, then start with `$onboard`.

<details>
<summary>Notes</summary>

- This installs 10 protocols + `onboard`. `/report`, `/dashboard`, `/preferences`, `reflexion`, `write` are not included.
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
| [Prosoche](./prosoche) | `/attend` | Executing tasks and want risky actions gated for your judgment |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Horismos](./horismos) | `/bound` | You need to define what you know vs what AI should figure out |
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need to actually understand them |

Concern clusters: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/grasp`)

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/report`, `/dashboard`, `/preferences` | Protocol learning, usage analysis, coverage dashboard, and configuration |

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
