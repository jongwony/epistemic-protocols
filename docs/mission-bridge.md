# Mission Bridge

This document keeps the repo's mission/vision wording aligned across maintainer-facing surfaces. It exists for repo governance, not for end users trying to solve a task through the protocols.

## Canonical Umbrella

The maintainer-facing source of truth lives in [CLAUDE.md](../CLAUDE.md):

> Epistemic Protocols is a layered system for human-AI collaboration: it inserts structured checkpoints at decision points so misalignment is surfaced early, judged explicitly, and adapted before it compounds into expensive downstream work.

This statement is intentionally broader than the README hook. It is the canonical umbrella for repo-level mission and vision edits within maintainer/contributor documentation. It is not a runtime or user-facing canonical contract.

## Public Contract

Public-facing docs use a distilled version of that umbrella:

- Lead with the easiest entry story: catching wrong directions early, especially at the plan level
- Make clear that the same checkpoint discipline also covers execution, verification, recall, and comprehension
- Remain self-sufficient: a reader should not need contributor docs to understand what the project is for

The README remains the source of truth for the Codex-supported install set. It is not the canonical source for the full machinery description.

## Runtime Boundary

Actual protocol users should not need mission/vision wording to use the system correctly.

- Discovery/onboarding may pass through README or landing copy
- Runtime use passes through `SKILL.md` and plugin descriptions
- Maintainer mission/vision edits must never create a dependency from runtime usage back to `CLAUDE.md` or this bridge

If a user would need to read mission/vision docs to understand how to invoke or trust a protocol, the boundary has been violated.

## Audience Layers

| Surface | Primary audience | Job |
|---|---|---|
| `README.md`, `README_ko.md`, landing copy | New users evaluating the project | Explain why the project exists and when to reach for it |
| Protocol `SKILL.md` and plugin descriptions | Actual runtime users | Provide the self-contained user contract for invocation and use |
| `docs/mission-bridge.md` | Maintainers and curious contributors | Keep public promise, runtime boundary, and contributor framing aligned |
| `CLAUDE.md` | Contributors and coding agents | Hold the maintainer-facing canonical umbrella statement and explain the repo's machinery |

This is a layered core, not a dual mission. The wording changes by audience; the umbrella stays the same.

## Protocol Coverage

Under the canonical umbrella, the protocol set covers decision points across the collaboration lifecycle:

- Planning: clarify intent, define goals, infer missing context
- Analysis: frame perspectives, ground abstract advice
- Decision: surface unnoticed gaps before commitment
- Execution: route upstream deficits and evaluate execution-time risk
- Verification: check applicability after execution
- Cross-cutting: define epistemic boundaries, recover prior context, verify comprehension

This is why the public hook can stay narrow while the project still legitimately includes Prosoche, Epharmoge, Anamnesis, and Katalepsis.

## Editing Rule

When mission or vision wording changes:

1. Update the canonical umbrella statement in `CLAUDE.md`
2. Update this bridge document's public contract and runtime boundary if needed
3. Update README and landing copy as audience-specific derivations
4. Verify that no `SKILL.md` or plugin description now depends on mission/vision documents for correct use

If a change makes README depend on CLAUDE to be understandable, the bridge has failed and the public contract needs revision. If a change makes runtime users depend on mission/vision documents, the boundary has failed.
