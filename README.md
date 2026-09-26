# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch misalignment early — often at the plan level, before it hardens into code or other downstream work. Fix the direction before the implementation compounds it.

## Why

Correcting a wrong direction at the plan level can cost one conversation turn.
Once it hardens into code, rollout steps, or downstream explanations, it can cost hours of rework.
These protocols add structured checkpoints to help you and the AI catch and correct a wrong direction before more work depends on it.

## Where the protocols help

Use the protocols to catch a wrong direction while planning, before it shapes later work. The same structured checkpoints also help when you hand work to an autonomous run, check a result against your actual situation, recall an earlier discussion, or make sure you understand something before building on it.

## Quick Start

### Claude Code

Install every protocol:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

Then invoke a protocol at the decision point you are at — for example `/inquire` before handing work to the AI, or `/bound` when you cannot yet see what a task needs you to decide.

Utility plugins are opt-in and installed separately. `epistemic-cooperative` adds guided learning (`/onboard`), deficit recognition (`/probe`), and contributor tools. The experimental [`route`](#route) plugin helps the agent invoke a suitable protocol from the conversation context and find relevant collaboration principles when needed. Add either plugin:

```bash
claude plugin install epistemic-cooperative@epistemic-protocols
claude plugin install route@epistemic-protocols
```

With `epistemic-cooperative` installed, `/onboard` gives a quick recommendation from your recent sessions and can continue into guided learning with scenarios, trials, and quizzes.

### Codex

This repository is also a Codex plugin marketplace. To add it from GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash
```

For local development from a checkout:

```bash
codex plugin marketplace add /path/to/epistemic-protocols
```

The Codex marketplace keeps the same plugin boundaries as Claude Code: each protocol is its own plugin, and `epistemic-cooperative` carries the utility skills. The marketplace lives at [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json); each plugin keeps its Codex manifest beside its Claude manifest at `<plugin>/.codex-plugin/plugin.json`.

### Other agent tools

Protocol skill sources live in each plugin directory under `<plugin>/skills/<name>/SKILL.md`. The repository does not ship a pre-materialized `.agents/skills/` symlink view because Codex marketplace discovery can scan both plugin manifests and Agent Skills symlinks, producing duplicate skill entries.

Hosts that need an [Agent Skills](https://agentskills.io/specification)-style view should materialize it outside the Codex marketplace checkout or use host-specific packaging. Runtime *tool grounding* still varies by tool, so protocol behavior in non-Claude-Code hosts is provisional pending accumulated cross-host use evidence.

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Aitesis](./aitesis) | `/inquire` | A task rests on missing context or unchecked assumptions, and you need to see what remains unknown |
| [Euporia](./euporia) | `/elicit` | You know roughly what you want but can't yet say which decisions it turns on — and your own material (codebase, rules, past sessions) holds the clues |
| [Heuresis](./heuresis) | `/ideate` | You have no candidates yet, or they narrowed to one too early — widen the field before choosing any |
| [Proplasma](./proplasma) | `/preview` | You're about to commit to one of several directions, but you can't judge them from their descriptions — you'd have to see them first |
| [Hypotyposis](./hypotyposis) | `/sketch` | You have to make something and can't say what it should be, but you'd recognize it on sight |
| [Analogia](./analogia) | `/ground` | You're carrying a framework or an analogy over to a case already in front of you, and it isn't clear what that comparison actually supports |
| [Periagoge](./periagoge) | `/induce` | Several concrete cases seem to share something you can't name yet — pin down what they have in common |
| [Merismos](./merismos) | `/apportion` | You're about to hand one goal to an autonomous run — cut it into units that each fit one stretch of the run and can tell when they are done |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but may not fit your actual situation |
| [Elenchus](./elenchus) | `/sublate` | The context you are about to act on may no longer hold — stale, weakly sourced, or contradicted — vet it dialectically before acting |
| [Horismos](./horismos) | `/bound` | You cannot yet see what needs deciding in a task, or which decisions to keep or entrust |
| [Anamnesis](./anamnesis) | `/recollect` | You vaguely remember something was discussed before but cannot name it — one session, or a line of work, topic, or concept spread across several |
| [Katalepsis](./katalepsis) | `/grasp` | Something in front of you — code, a document, a result — needs to be actually understood: you can't follow it yet, or you nod along and aren't sure |
| [Hyphegesis](./hyphegesis) | `/conduct` | The work takes several lines of thinking, and it isn't obvious what order they run in, which can run apart, how their results combine, when to stop, or where each result goes — settle how it runs before starting |

Concern clusters: Planning (`/inquire`, `/elicit`, `/ideate`, `/preview`, `/sketch`) · Analysis (`/ground`, `/induce`) · Execution (`/apportion`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`, `/conduct`)

## Utilities

For utility plugin installation in Claude Code, see [Quick Start](#claude-code).

### [Epistemic Cooperative](./epistemic-cooperative)

Skills that act at their own decision points — around the protocols, on the work itself, and on the prose that steers the agent.

| Command | When to use |
|---------|-------------|
| **Finding the protocol** | |
| `/onboard` | New here — get one recommendation from your recent sessions, then optionally learn by scenario, trial, and quiz |
| `/probe` | Something feels off but you cannot name which deficit it is — several hypotheses, routed by your recognition |
| **Shaping the work** | |
| `/forge` | You need a prompt or a standing skill recipe grounded in a vendor reference (a model prompt guide, the Codex Goals spec), not one written from memory |
| `/reduced-space-test` | A claim that a stand-in behaves like the real target — test it in a bounded space and carry the untested remainder forward explicitly |
| `/gate-check` | An option set is about to be presented to you — an independent advisor rules it genuine, collapsed, or malformed, and its cited grounds are verified first |
| **Reviewing a change** | |
| `/review-loop` | Drive a change through review until every finding is verified against the codebase and disposed of, re-reviewing each round |
| **Auditing instruction prose** | |
| `/white-bear` | Prose that tells the agent what not to do — find prohibition framing and negated anchoring that keep the wrong target in view |
| `/zero-shot` | Prose that anchors on examples where a principle would generalize — find and name those spots |
| **Steering the project** | |
| `/realign` | The project guide's direction line no longer matches where the work is going — fuse the inscribed line, outside signals, and your present understanding |
| **Delegating to Codex** | |
| `/goal-research` | A factual research question you want scoped and externally verified in a background Codex session, with the full trace returned |

### [Route](./route)

> **Experimental.** The hook set and the injected wording can change between releases, and the optional advisory channel is unvalidated — see [route/README.md](./route/README.md) before depending on either.

Context-driven protocol routing. A session-start hook places the installed-protocol deficit table and the [premise](./premise) index at the head of context, once per context epoch; a per-prompt hook places a short directive beside each prompt. When the accumulated context shows a deficit exactly one installed core protocol resolves, the agent invokes that protocol, nudges when several fit, and stays silent when none does. The invoked protocol's own first gate keeps your judgment where it was.

## For Contributors

Start with [ONBOARDING.md](./ONBOARDING.md). Paste the full file into a fresh Claude Code session to use Claude as an onboarding buddy for environment setup, core docs, and the contribution workflow.

For architecture, read [CLAUDE.md](./CLAUDE.md). For the underlying collaboration principles, explore [premise/](./premise/).

When editing the project's public description, follow the guidance in [Mission Bridge](./docs/mission-bridge.md).

<details>
<summary>Greek Codex</summary>

| Protocol | Greek | Meaning |
|----------|-------|---------|
| Katalepsis | κατάληψις | Grasping, comprehension |
| Horismos | ὁρισμός | A bounding |
| Aitesis | αἴτησις | Request, inquiry |
| Analogia | ἀναλογία | Proportion |
| Periagoge | περιαγωγή | Turning-around |
| Euporia | εὐπορία | Way through, resourcefulness |
| Merismos | μερισμός | Apportionment |
| Epharmoge | ἐφαρμογή | Application, fitting |
| Elenchus | ἔλεγχος | Cross-examination, refutation |
| Anamnesis | ἀνάμνησις | Recollection |
| Hyphegesis | ὑφήγησις | Leading the way, guiding from ahead |
| Proplasma | πρόπλασμα | Preliminary model, first mold |
| Hypotyposis | ὑποτύπωσις | Outline, first sketch |
| Heuresis | εὕρεσις | Finding, discovery |

</details>

## Acknowledgments

- [@yolohyo](https://github.com/yolohyo) — Comment-lifecycle UX design contribution for comment-review (the skill has since moved to [cc-plugin](https://github.com/jongwony/cc-plugin) as a protocol-free substrate plugin)
- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution for Onboard

## License

MIT
