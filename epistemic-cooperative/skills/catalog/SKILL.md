---
name: catalog
description: "Protocol handbook — instant reference for when to use each epistemic protocol."
---

# Catalog Skill

Instant reference handbook for 10 epistemic protocols. Browse by cluster, look up by command, or find the right protocol for a situation.

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
| `/catalog` | Overview: 10 protocols grouped by cluster, 1-line each + usage hints |
| `/catalog {cluster}` | Cluster detail: expanded protocol cards with scenarios |
| `/catalog {command}` | Single protocol detail: full card from scenarios.md |

Argument normalization: case-insensitive, accepts `/command` or bare name (e.g., `/catalog clarify` = `/catalog /clarify` = `/catalog Hermeneia`).

## Protocol Catalog

### Planning

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Hermeneia | `/clarify` | What you said differs from what you meant |
| Telos | `/goal` | Goal is vague — no success criteria or scope |
| Aitesis | `/inquire` | Context is insufficient for confident execution |

### Analysis

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Prothesis | `/frame` | No framework — need analytical lenses or multi-perspective team |
| Analogia | `/ground` | Abstract idea needs concrete domain validation |

### Decision

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Syneidesis | `/gap` | About to act — potential gaps unexamined |

### Execution

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Prosoche | `/attend` | Execution risks not yet classified or delegated |

### Verification

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Epharmoge | `/contextualize` | Output is correct but may not fit the actual context |

### Cross-cutting

| Protocol | Command | When to Use |
|----------|---------|-------------|
| Horismos | `/bound` | Unclear who decides what — ownership boundaries undefined |
| Katalepsis | `/grasp` | AI did work but you don't fully understand what or why |

## Detail Mode

When a cluster name or protocol command/name is provided as argument:

1. Normalize the argument:
   - Strip leading `/` if present
   - Match case-insensitively against protocol names (Hermeneia, Telos, etc.) and commands (clarify, goal, etc.)
   - Match cluster names: planning, analysis, decision, execution, verification, cross-cutting

2. For **cluster** arguments: display all protocol cards in that cluster with expanded "When to Use" descriptions from the tables above.

3. For **protocol** arguments: call Read on `epistemic-cooperative/skills/onboard/references/scenarios.md`, extract the matching `## ProtocolName /command` block, and present:
   - **Situation**: the scenario description
   - **Intervention**: how the protocol helps
   - **Philosophy**: the Greek etymology and core principle
   - **Try it**: `/{command}` — direct invocation prompt

4. If no match found: list the closest matches and suggest `/catalog` for the full overview.

## Rules

1. **No AskUserQuestion** — pure text output only. This skill is a passive reference, not an interactive dialogue.
2. **No delegation** — main agent handles all output directly. Read tool for scenarios.md detail mode only.
3. **Static overview, dynamic detail** — the Protocol Catalog tables above are embedded and authoritative. Detail mode reads scenarios.md at runtime for richer content.
4. **Argument normalization** — accept case-insensitive input; strip `/` prefix; match against both protocol names and commands.
5. **Graceful fallback** — unrecognized arguments get closest-match suggestions plus the full overview.
6. **Distinction from /onboard** — catalog is passive reference (read and go); onboard is active learning (scenario, trial, quiz). Never redirect to onboard unless the user explicitly asks for guided learning.
