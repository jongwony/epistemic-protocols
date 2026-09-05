# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols catch misalignment early — often at the plan level, before it hardens into code or other downstream work. Fix the direction before the implementation compounds it.

## Why

Correcting a wrong direction at the plan level can cost one conversation turn.
Once it hardens into code, rollout steps, or downstream explanations, it can cost hours of rework.
These protocols insert structured checkpoints at decision points — intent, goal, context, perspective, execution, applicability, recall, and comprehension — so you and AI can surface, judge, and adapt misalignment before it compounds.

## Mission and Machinery

**Stated Mission** — the public hook: catch wrong directions early, especially at the plan level. This is the clearest entry story and how most users reach for the protocols.

**Realized Machinery** — the actual coverage: structured checkpoints span planning, analysis, decision, execution, verification, recall, and comprehension. Protocols such as Merismos (goal apportionment into conditioned execution units), Epharmoge (post-execution applicability), Anamnesis (session recall), and Katalepsis (comprehension verification) extend beyond plan-level alone.

The two layers serve different audiences: the README carries the narrow public contract; `SKILL.md` and `CLAUDE.md` describe the full machinery. See [docs/mission-bridge.md](./docs/mission-bridge.md) for the governance rules that keep these layers aligned.

## Quick Start

### Claude Code

Install every protocol:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

Then invoke a protocol at the decision point you are at — for example `/inquire` before handing work to the AI, or `/bound` before a refactor that crosses several domains.

The two utility plugins are opt-in, so the one-liner leaves them out. `epistemic-cooperative` adds learning and lookup (`/onboard`, `/catalog`, `/probe`) plus contributor tooling; `route` carries a per-prompt hook. Add either on its own:

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
| [Aitesis](./aitesis) | `/inquire` | AI charges ahead without asking what it needs to know |
| [Euporia](./euporia) | `/elicit` | You have intent but the decision coordinates are implicit — reverse-trace them from the externalized substrate (codebase, rules, past sessions) until intent crystallizes |
| [Heuresis](./heuresis) | `/ideate` | The candidate field for a decision is empty or has prematurely converged — widen it into a diverse set before any selection, not after |
| [Proplasma](./proplasma) | `/preview` | Right before committing to a direction — the candidates read fine but you'd have to see them to judge; contrast cheap discard-committed probes first |
| [Prothesis](./prothesis) | `/frame` | Need to settle which lens to look through before the analysis starts — one lens or several |
| [Analogia](./analogia) | `/ground` | AI's advice sounds right in theory but unclear in your context |
| [Periagoge](./periagoge) | `/induce` | One or more concrete cases accumulating into an unnamed essence — crystallize the emerging abstraction |
| [Merismos](./merismos) | `/apportion` | About to hand a goal to an autonomous run — cut it into units that each fit one interval and close each unit first — on its own done-condition where one compiles, on your recorded acceptance where none does, or on a reservation where a judgment rather than a check settles it |
| [Epharmoge](./epharmoge) | `/contextualize` | AI's output is correct but doesn't fit your situation |
| [Elenchus](./elenchus) | `/sublate` | About to externalize a working context that may have decayed — vet it dialectically first |
| [Horismos](./horismos) | `/bound` | An epistemic boundary is undefined — direction/priority, scope, type/concept, or who decides (ownership) |
| [Anamnesis](./anamnesis) | `/recollect` | You vaguely remember something was discussed before but cannot name it — one session, or a line of work, topic, or concept spread across several |
| [Katalepsis](./katalepsis) | `/grasp` | Code, a paper, or a big change you need to actually understand — you can't follow it yet, or you nod along and aren't sure. Verify your understanding is genuine before you approve or build on it |
| [Hyphegesis](./hyphegesis) | `/conduct` | Multiple cognitive moves whose order, independence, reconciliation, stopping (termination), and routing aren't obvious — conduct how the whole session's work runs before starting |

Concern clusters: Planning (`/inquire`, `/elicit`, `/ideate`, `/preview`) · Analysis (`/frame`, `/ground`, `/induce`) · Execution (`/apportion`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`, `/conduct`)

## Utilities

Two plugins sit beside the protocols. Both are opt-in for the Claude Code one-liner:

```bash
claude plugin install epistemic-cooperative@epistemic-protocols
claude plugin install route@epistemic-protocols
```

### [Epistemic Cooperative](./epistemic-cooperative)

Skills that act at their own decision points — around the protocols, on the work itself, and on the prose that steers the agent.

| Command | When to use |
|---------|-------------|
| **Finding the protocol** | |
| `/onboard` | New here — get one recommendation from your recent sessions, then optionally learn by scenario, trial, and quiz |
| `/catalog` | You already know the question — browse the handbook by cluster or look a command up |
| `/probe` | Something feels off but you cannot name which deficit it is — several hypotheses, routed by your recognition |
| **Shaping the work** | |
| `/triage` | A pile of GitHub issues needs to become focused work units, each fused with the project's northstar and handed to a session by pointer |
| `/forge` | You need a prompt or a standing skill recipe grounded in a vendor reference (a model prompt guide, the Codex Goals spec), not one written from memory |
| `/reduced-space-test` | A claim that a stand-in behaves like the real target — test it in a bounded space and carry the untested remainder forward explicitly |
| `/gate-check` | An option set is about to be presented to you — an independent advisor rules it genuine, collapsed, or malformed, and its cited grounds are verified first |
| **Reviewing a change** | |
| `/review-loop` | Drive a change through review until every finding is verified against the codebase and disposed of, re-reviewing each round |
| `/lens-review` | One consolidated PR comment from several analytical lenses plus a gap scan, each analyzed in isolation and cross-verified |
| **Auditing instruction prose** | |
| `/place` | An instruction file keeps growing — route each clause to where it belongs (a load tier, the ledger, or deletion) |
| `/white-bear` | Prose that tells the agent what not to do — find prohibition framing and negated anchoring that keep the wrong target in view |
| `/zero-shot` | Prose that anchors on examples where a principle would generalize — find and name those spots |
| **Steering the project** | |
| `/steer` | Your rules and the agent's actual behavior have drifted apart — audit the drift, give per-cluster verdicts, and rewrite the project profile |
| `/realign` | The project guide's direction line no longer matches where the work is going — fuse the inscribed line, outside signals, and your present understanding |
| **Delegating to Codex** | |
| `/goal-research` | A factual research question you want scoped and externally verified in a background Codex session, with the full trace returned |

### [Route](./route)

Context-driven protocol routing. A per-prompt hook places a short directive beside each prompt; when the accumulated context shows a deficit exactly one installed core protocol resolves, the agent invokes that protocol, nudges when several fit, and stays silent when none does. The invoked protocol's own first gate keeps your judgment where it was.

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
| Heuresis | εὕρεσις | Finding, discovery |

</details>

## Acknowledgments

- [@yolohyo](https://github.com/yolohyo) — Comment-lifecycle UX design contribution for comment-review (the skill has since moved to [cc-plugin](https://github.com/jongwony/cc-plugin) as a protocol-free substrate plugin)
- [@zzsza](https://github.com/zzsza) — Quiz-based participatory UX design contribution for Onboard

## License

MIT
