# Epistemic Protocols

> [한국어](./README_ko.md)

When AI collaboration goes off-track, you redo everything. These protocols bring the decisions that set the direction to you early — often at the plan level, before a wrong one hardens into code or other downstream work — and leave each one yours to settle. Fix the direction before the implementation compounds it.

## Why

As models improve, a well-written prompt goes a long way: if it already states everything that matters, working with or without a protocol can lead to nearly the same result.
Writing that prompt is the hard part. It means recalling every unknown at once and anticipating the cases the work will meet at runtime, alone, before the first reply.
What the prompt missed surfaces later, and the later it surfaces the more it costs: a wrong direction corrected at the plan level can cost one conversation turn, while one found after release to a live service costs rework that grows with everything built on it.
The protocols make the AI a thinking partner at those decision points. It asks, and you answer with what the question brings to mind; it presents candidates, and you recognize which one fits. Many of the items that end up deciding the work are ones you could not have listed at the start.

For example, "Write the email announcing next week's meeting":

| Decision | Without a protocol | With `/inquire` |
|---|---|---|
| Who receives it | The AI decides alone | Asked — you recall and answer |
| What the meeting is for (decide or share) | The AI decides alone | Asked — you recall and answer |
| Date and place | Asked — you answer | Asked — you recall and answer |
| Whether to ask for replies | The AI decides alone | Presented — you recognize it |
| Length | The AI decides alone | Presented — you correct it |
| Tone | The AI decides alone | The AI decides alone |

This is an illustration, not a run result: which items come up, and how, varies with the model and the person. A decision the AI makes alone is not wrong for that; what differs is whether it passed through you.

## Where the protocols help

Use the protocols to catch a wrong direction while planning, before it shapes later work. The same structured checkpoints also help when you hand work to an autonomous run, check a result against your actual situation, recall an earlier discussion, or make sure you understand something before building on it.

## Quick Start

### Claude Code

Install every protocol, together with the [`route`](#route) and [`epistemic-cooperative`](#epistemic-cooperative) plugins:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

`route` lets the agent invoke a suitable protocol from the conversation context, and find relevant collaboration principles when needed, so you do not have to know which protocol fits. It is still experimental: its wording and hook set can change between releases. `epistemic-cooperative` adds guided learning (`/onboard`), deficit recognition (`/probe`), and contributor tools. To leave either one out, run `claude plugin disable <name>@epistemic-protocols` after installing; without `route`, every protocol stays installed and callable by its own command.

You can also invoke a protocol yourself at the decision point you are at — for example `/inquire` before handing work to the AI, or `/bound` when you cannot yet see what a task needs you to decide.

`/onboard` gives a quick recommendation from your recent sessions and can continue into guided learning with scenarios, trials, and quizzes.

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

A protocol's checkpoint presents its decisions and what each answer changes; it does not by itself suspend execution, so on a non-interactive run such as `codex exec` the decisions can arrive after the work has started.

### Other agent tools

Protocol skill sources live in each plugin directory under `<plugin>/skills/<name>/SKILL.md`. The repository does not ship a pre-materialized `.agents/skills/` symlink view because Codex marketplace discovery can scan both plugin manifests and Agent Skills symlinks, producing duplicate skill entries.

Hosts that need an [Agent Skills](https://agentskills.io/specification)-style view should materialize it outside the Codex marketplace checkout or use host-specific packaging. Runtime *tool grounding* still varies by tool, so protocol behavior in non-Claude-Code hosts is provisional pending accumulated cross-host use evidence.

## Protocols

| Protocol | Command | When to use |
|----------|---------|-------------|
| [Aitesis](./aitesis) | `/inquire` | A task rests on missing context or unchecked assumptions, and you need to see what remains unknown |
| [Euporia](./euporia) | `/elicit` | You know roughly what you want but can't yet say which decisions it turns on — and your own material (codebase, rules, past sessions) and the domain's usual decisions hold the clues |
| [Heuresis](./heuresis) | `/ideate` | You have no candidates yet, or the field narrowed too early — widen it before choosing any |
| [Proplasma](./proplasma) | `/preview` | You're about to commit to one of several directions, but you can't judge them from their descriptions — you'd have to see them first |
| [Hypotyposis](./hypotyposis) | `/sketch` | You have to make something and can't say what it should be, but you'd recognize it on sight |
| [Analogia](./analogia) | `/ground` | You're carrying a framework, an analogy, or an earlier design over to a case, or checking an abstraction against its own cases, and it isn't clear what that comparison actually supports |
| [Periagoge](./periagoge) | `/induce` | Several concrete cases seem to share something you can't name yet — pin down what they have in common |
| [Merismos](./merismos) | `/apportion` | You're about to hand one goal to an autonomous run — cut it into units that each fit one stretch of the run and can tell when they are done |
| [Epharmoge](./epharmoge) | `/contextualize` | A result — this session's or another's — may be correct but not fit your actual situation, or leave out something you asked for |
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
| `/reduced-space-test` | A claim that a stand-in behaves like the real target — test it in a bounded space and carry the untested remainder forward explicitly |
| `/gate-check` | An option set is about to be presented to you — an independent advisor rules it genuine, collapsed, or malformed, and its cited grounds are verified first |
| **Reviewing a change** | |
| `/review-loop` | Drive a change through review until every finding is verified against the codebase and disposed of, re-reviewing each round |
| **Auditing instruction prose** | |
| `/white-bear` | Prose that tells the agent what not to do — find prohibition framing and negated anchoring that keep the wrong target in view |
| `/zero-shot` | Prose that anchors on examples where a principle would generalize — find and name those spots |
| **Steering the project** | |
| `/realign` | The project guide's direction line no longer matches where the work is going — fuse the inscribed line, outside signals, and your present understanding |
| **Delegating research** | |
| `/goal-research` | An academic-literature research question you want externally verified in a background run — Claude by default, or Codex — with per-claim verification strength against primary sources, replication status for empirical effects, what only you can settle returned to you open, and its citations checked against the run's own Tavily record, the same run continued while its gaps shrink |

### [Route](./route)

> **Experimental.** The hook set and the injected wording can change between releases, and the optional advisory channel is unvalidated — see [route/README.md](./route/README.md) before depending on either.

Context-driven protocol routing. A session-start hook places the installed-protocol deficit table and the [premise](./premise) index at the head of context, once per context epoch; a per-prompt hook places a short directive beside each prompt. When the accumulated context shows a deficit exactly one installed core protocol resolves, the agent invokes that protocol, nudges when several fit, and stays silent when none does. The invoked protocol's own first gate keeps your judgment where it was.

## What the checks cover

Different mechanisms check different things, and it helps to know where each one stops.

- **Lean proofs** — a protocol's contract is also written as a Lean model inside its `SKILL.md`. Lean checks that the properties stated about that model hold, under the assumptions the model declares; the judgments the model leaves open are among those assumptions, not things it proves. A protocol's [`lean/EpistemicProtocols/<Protocol>/Theorems.lean`](./lean/EpistemicProtocols) holds what is stated and proved about its model.
- **Runtime evidence** — the contributor skill [`/realize`](./.claude/skills/realize/SKILL.md) runs a protocol in a real session and collects evidence that the steps it declares actually happen, through automatic checks plus a review of the transcript.
- **Static checks** — [`/verify`](./.claude/skills/verify/SKILL.md) checks the files' structure: required sections, consistent names and references, matching versions.

None of these measures what happens downstream of a protocol, such as whether it reduces rework, and that is deliberate: how much a protocol helps depends on what each person does not yet know, and on the model, which keeps improving. What a run can show is which decisions entered the conversation because the AI asked or presented them rather than because they were written up front. The contributor skill [`/outcome`](./.claude/skills/outcome/SKILL.md) runs the same request with and without a protocol and lists those decisions with the passages they came from.

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
