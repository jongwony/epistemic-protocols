# Runtime Dependency Ledger

This ledger separates four claim-strength buckets that often get conflated in protocol prose.

| Bucket | Meaning |
|--------|---------|
| `Normative contract` | What the runtime user may rely on from packaged `SKILL.md` |
| `Runtime description metadata` | Plugin `description` field used for discovery/routing under tight length budget |
| `Claude Code realization` | How the current platform typically realizes the contract (slash invocation, Agent/Task, hooks, packaging) |
| `Heuristic/advisory only` | Model judgment or soft safeguards with no hard runtime guarantee |

Read a given protocol's bucket assignments off its own `SKILL.md`. A per-protocol table here would restate every protocol's contract in prose that nothing re-runs, and each row would go on asserting an earlier reading of a file that has since moved — with the summary carrying the same present-tense authority as the contract it summarizes.

## Why the buckets are kept apart

- **Description metadata is deliberately weaker than the contract.** It operates under a marketplace length budget, so it is written and judged for routing clarity rather than semantic completeness. Reading a description as the contract under-specifies what the protocol actually guarantees.
- **A platform realization is not part of the contract.** It is how one host happens to satisfy it. Reading a realization as contract makes a protocol look broken on a host that satisfies the same contract differently, and makes a host-specific convenience look like a promise.
- **An advisory item carries no runtime guarantee.** A reader who takes one as a guarantee designs against a promise nobody made, and the failure surfaces only once the judgment it rested on goes the other way.

The boundary between these surfaces and the packaged runtime-contract view is stated in `AGENTS.md` §Settled Directions (Surface authority order) and enforced by `artifact-self-containment`.
