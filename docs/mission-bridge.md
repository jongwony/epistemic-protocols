# Mission Bridge

This document keeps the repo's mission/vision wording aligned across maintainer-facing surfaces. It exists for repo governance, not for end users trying to solve a task through the protocols.

## Canonical Umbrella

The maintainer-facing source of truth is the **Northstar** section of [CLAUDE.md](../CLAUDE.md) — read it there rather than mirrored here, so this bridge document never drifts from the live statement.

That statement is intentionally broader than the README hook. It is the canonical umbrella for repo-level mission and vision edits within maintainer/contributor documentation. It is not a runtime or user-facing canonical contract.

## Runtime Boundary

Actual protocol users should not need mission/vision wording to use the system correctly.

- Discovery/onboarding may pass through the README
- Runtime use passes through `SKILL.md` and plugin descriptions
- Maintainer mission/vision edits must never create a dependency from runtime usage back to `CLAUDE.md` or this bridge

If a user would need to read mission/vision docs to understand how to invoke or trust a protocol, the boundary has been violated.

## Audience Layers

| Surface | Primary audience | Job |
|---|---|---|
| `README.md`, `README_ko.md` | New users evaluating the project | Explain why the project exists and when to reach for it |
| Protocol `SKILL.md` and plugin descriptions | Actual runtime users | Provide the self-contained user contract for invocation and use |
| `docs/mission-bridge.md` | Maintainers and curious contributors | Keep public promise, runtime boundary, and contributor framing aligned |
| `CLAUDE.md` | Contributors and coding agents | Hold the maintainer-facing canonical umbrella statement and explain the repo's machinery |

This is a layered core, not a dual mission. The wording changes by audience; the umbrella stays the same.
