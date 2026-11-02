# `route/` — the delivery layer

**Responsibility under the Northstar** (root `AGENTS.md`). A protocol helps only if it arrives before a misalignment hardens, and a person cannot be expected to remember every protocol at that moment. This plugin puts what the agent needs to bring the fitting protocol in at the head of its context, and it is one way a user takes up the optional premise layer (`premise/README.md`).

**Boundary.** The plugin carries no skill. `purpose.md` is the one home of the two protocols to reach for first; `hooks/` and `scripts/` are the delivery machinery that puts it, the protocol table and the premise index in front of the agent at session start, and `scripts/route-premise.mjs` holds that index. `evals/` holds the routing cases and the harness that measures whether a delivered premise is applied. Each protocol's own contract stays in that protocol's directory; Route adds no checkpoint of its own.

**Next.** `purpose.md`, then `README.md` for which parts are experimental.
