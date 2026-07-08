---
name: catalog
description: "Protocol handbook — instant reference for when to use each epistemic protocol."
---

# Catalog Skill

Instant reference handbook for 16 epistemic protocols. Browse by cluster, look up by command, or find the right protocol for a situation.

## When to Use

Invoke this skill when:
- Quick reference: "which protocol handles X?"
- Browsing: exploring available protocols without commitment
- Situation lookup: matching a current situation to the right protocol

Skip when:
- Guided learning with practice and quizzes (use `/onboard`)
- Session analytics and growth analysis (use `/report`)
- Full coverage dashboard (use `/dashboard`)

## Argument Handling

| Invocation | Behavior |
|------------|----------|
| `/catalog` | Overview: 16 protocols grouped by cluster, 1-line each + usage hints |
| `/catalog {cluster}` | Cluster detail: expanded protocol cards with scenarios |
| `/catalog {command}` | Single protocol detail: full card from scenarios.md |

Argument normalization: case-insensitive, accepts `/command` or bare name (e.g., `/catalog inquire` = `/catalog /inquire` = `/catalog Aitesis`).

## Protocol Catalog

### Planning

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Aitesis | `/inquire` | Context is insufficient for confident execution |
| Euporia | `/elicit` | Intent articulated but decision coordinates implicit in externalized substrate — reverse-trace to surface |

### Analysis

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Prothesis | `/frame` | No framework — need analytical lenses or a multi-perspective inquiry spec |
| Analogia | `/ground` | An abstract idea's correspondence to a concrete domain is uncertain — needs structural grounding, not just assertion |
| Periagoge | `/induce` | Concrete instances accumulating — abstraction has not located itself |

### Decision

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Syneidesis | `/gap` | About to act — potential gaps unexamined |

### Execution

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Prosoche | `/attend` | Autonomous run ahead with its boundaries not yet compiled into verifiable conditions |

### Verification

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Epharmoge | `/contextualize` | Output is correct but may not fit the actual context — post-execution |
| Elenchus | `/sublate` | About to externalize a working context whose apparent sufficiency may have decayed — pre-execution |

### Cross-cutting

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Horismos | `/bound` | Unclear who decides what — ownership boundaries undefined |
| Anamnesis | `/recollect` | A vague, ambiguous recall you can't quite pin down — resolve it into recognized context |
| Anagoge | `/ascend` | A recall a single session can't resolve — elevate it to a higher-granularity unit (connected-session chain, topic cluster, or already-sedimented concept) |
| Diylisis | `/distill` | Handoff context to a fresh zero-memory session — distill out session-tethered references into a portable handoff |
| Katalepsis | `/grasp` | AI-produced work you assume you grasp but haven't verified — comprehension may be an illusion; confirm your understanding is genuine before you approve, explain, or build on it |
| Hyphegesis | `/conduct` | Multiple cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial — conduct the session's method before object-level work begins |
| Diairesis | `/delimit` | A large body of work spans many execution units but where to cut it into right-sized pieces is unclear — partition it at natural joints (each unit fits one span, complete coverage with no orphans) before conducting |

## Detail Mode

When a cluster name or protocol command/name is provided as argument:

1. Normalize the argument:
   - Strip leading `/` if present
   - Match case-insensitively against protocol names (Aitesis, Euporia, etc.) and commands (inquire, elicit, etc.)
   - Match cluster names: planning, analysis, decision, execution, verification, cross-cutting

2. For **cluster** arguments: display all protocol cards in that cluster with expanded "When to Use" descriptions from the tables above.

3. For **protocol** arguments: call Read on `epistemic-cooperative/skills/onboard/references/scenarios.md`, extract the matching `## ProtocolName /command` block, and present:
   - **Situation**: the scenario description
   - **Intervention**: how the protocol helps
   - **Philosophy**: the Greek etymology and core principle
   - **Try it**: `/{command}` — direct invocation prompt

4. If no match found: list the closest matches and suggest `/catalog` for the full overview.

## Rules

1. **No gate interaction** — pure text output only. This skill is a passive reference, not an interactive dialogue.
2. **No delegation** — main agent handles all output directly. Read tool for scenarios.md detail mode only.
3. **Static overview, dynamic detail** — the Protocol Catalog tables above are embedded and authoritative. Detail mode reads scenarios.md at runtime for richer content.
4. **Argument normalization** — accept case-insensitive input; strip `/` prefix; match against both protocol names and commands.
5. **Graceful fallback** — unrecognized arguments get closest-match suggestions plus the full overview.
6. **Distinction from /onboard** — catalog is passive reference (read and go); onboard is active learning (scenario, trial, quiz). Redirect to /onboard only when the user explicitly asks for guided learning.

## Agent routing (SessionStart injection)

The tables above are the human browse view. The agent-facing counterpart is `routing-map.md` — an auto-generated routing directive (do not edit by hand) built entirely from canonical sources: the `When to Use` triggers above plus each protocol's `Deficit → Resolution` spine. A passive skill description under-triggers invocation, so this map is injected at SessionStart to route the agent from the deficit, not the summary. Regenerate it after any protocol or trigger change:

```bash
node scripts/generate-routing-map.js
```

`scripts/session-context.js` is the SessionStart emitter: it reads `routing-map.md` and prints the hook payload on stdout. A consuming project wires it with a `settings.json` hook of type `command`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "node <plugin>/skills/catalog/scripts/session-context.js" }
        ]
      }
    ]
  }
}
```

Inject only the parts a project needs (the routing-directive preamble is always kept):

- `--only=/grasp,/gap` — include only the listed commands (comma-separated).
- `--cluster=Analysis,Decision` — include only the listed clusters (comma-separated).

With no filter, the full map is injected; when both filters are given they combine as a union.
