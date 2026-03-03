# Epistemic Protocols

> [한국어](./README_ko.md)

Claude Code plugin marketplace for epistemic dialogue.

## Quick Start

1. Install: `git clone https://github.com/jongwony/epistemic-protocols && bash epistemic-protocols/install.sh`
2. Run `/onboard` — analyzes your sessions and recommends protocols
3. Or pick from the table below

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Hermeneia](./hermeneia) | `/clarify` | Intent-expression gap detected |
| [Telos](./telos) | `/goal` | Goal is vague or indeterminate |
| [Epitrope](./epitrope) | `/calibrate` | Delegation scope is ambiguous |
| [Aitesis](./aitesis) | `/inquire` | Context insufficient before execution |
| [Prothesis](./prothesis) | `/frame` | Framework absent, multiple perspectives needed |
| [Syneidesis](./syneidesis) | `/gap` | Decision gaps unnoticed |
| [Prosoche](./prosoche) | `/attend` | Execution-time risk evaluation needed |
| [Epharmoge](./epharmoge) | `/contextualize` | Post-execution context mismatch suspected |
| [Katalepsis](./katalepsis) | `/grasp` | AI result ungrasped |

Order follows the epistemic workflow: Clarify → Goal → Calibrate → Inquire → Frame → Gap → Attend → Contextualize → Grasp

## Utilities

| Plugin | Command | Purpose |
|--------|---------|---------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/insights` | Session analytics and protocol recommendations |
| [Reflexion](./reflexion) | `/reflect` | Cross-session learning |
| [Write](./write) | `/write` | Multi-perspective blog drafting |

## Design

Each protocol resolves a specific cognitive deficit during AI-human interaction. For architecture details and design philosophy, see [CLAUDE.md](./CLAUDE.md).

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
| Prosoche | προσοχή | Attention |
| Epharmoge | ἐφαρμογή | Application, fitting |

</details>

## License

MIT
