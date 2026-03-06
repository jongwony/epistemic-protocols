# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch direction errors early — at the plan level, not the code level. Fix the direction, not the implementation.

## Why

Correcting a wrong direction at the plan level costs one conversation turn.
At the code level, it costs hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, delegation — so you and AI stay aligned before committing to implementation.

## Quick Start

1. Add the marketplace in Claude Code:
   ```
   /plugin marketplace add https://github.com/jongwony/epistemic-protocols
   ```
2. Install the [Epistemic Cooperative](./epistemic-cooperative) plugin:
   ```
   /plugin install epistemic-cooperative@epistemic-protocols
   ```
3. Run `/onboard` — analyzes your sessions and recommends protocols
4. Or pick individual protocols from the tables below

## Full Installation

Install all protocols and utilities at once:

```bash
git clone https://github.com/jongwony/epistemic-protocols && bash epistemic-protocols/scripts/install.sh
```

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Hermeneia](./hermeneia) | `/clarify` | AI keeps building what you didn't ask for |
| [Telos](./telos) | `/goal` | You know you want something but can't define success |
| [Epitrope](./epitrope) | `/calibrate` | Unsure how much to let AI decide on its own |
| [Aitesis](./aitesis) | `/inquire` | AI charges ahead without asking what it needs to know |
| [Prothesis](./prothesis) | `/frame` | Need to look at this from multiple angles, not sure which |
| [Syneidesis](./syneidesis) | `/gap` | About to commit but might be missing something |
| [Analogia](./analogia) | `/ground` | AI's advice sounds right in theory but unclear in your context |
| [Prosoche](./prosoche) | `/attend` | Want a risk check before executing a complex plan |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Katalepsis](./katalepsis) | `/grasp` | AI made big changes and you need to actually understand them |

Order follows the epistemic workflow: Clarify → Goal → Calibrate → Inquire → Frame → Ground → Gap → Attend → Contextualize → Grasp

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/dashboard` | Session analytics and protocol recommendations |
| [Reflexion](./reflexion) | `/reflect` | Cross-session learning |
| [Write](./write) | `/write` | Multi-perspective blog drafting |

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
| Aitesis | αἴτησις | Request, inquiry |
| Epitrope | ἐπιτροπή | Entrusting, delegation |
| Analogia | ἀναλογία | Proportion |
| Prosoche | προσοχή | Attention |
| Epharmoge | ἐφαρμογή | Application, fitting |

</details>

## License

MIT
