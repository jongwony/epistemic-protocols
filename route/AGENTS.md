# `route/` — `/route`

**Responsibility under the Northstar** (root `AGENTS.md`). A protocol helps only if it arrives before a misalignment hardens, and a person cannot be expected to remember every protocol at that moment. This plugin brings the fitting protocol in from what the conversation shows, and it is one way a user takes up the optional premise layer (`premise/README.md`).

**Boundary.** `skills/route/SKILL.md` is the contract for `/route`: how it matches the conversation against the installed protocols and when it invokes, points, or stays silent. `hooks/` and `scripts/` are the delivery machinery that puts the purpose the protocols serve (the contract's `## Purpose` section), the protocol table and the premise index in front of the agent at session start, and `scripts/route-premise.mjs` holds that index. `evals/` holds the routing cases and the harness that measures whether a delivered premise is applied. Each protocol's own contract stays in that protocol's directory; `/route` chooses among protocols and adds no checkpoint of its own.

**Next.** `skills/route/SKILL.md`, then `README.md` for which parts are experimental.
