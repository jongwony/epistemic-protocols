# Advanced Usage Patterns

Curated protocol usage patterns for Phase 6 Advanced Usage tips. Sourced from operational data across 1,100+ sessions over 15 days, except Protocol Chaining, which lists the edges the protocols' own contracts declare.

Provenance caveat: those sessions ran before `/apportion` existed. The rows marked *projected* that name it are projections onto the workflow slot a predecessor protocol occupied, carried forward because the slot is the same, and they are NOT observations under `/apportion`'s own contract — that predecessor compiled conditions for an already-bounded interval, while `/apportion` cuts a goal into units first. Read them as candidate chains until sessions under the current contract accumulate.

## Protocol Chaining

Composition edges a protocol's own contract declares — where one protocol's output is written to be picked up by the next. Declared, not observed frequencies, and not a prescribed sequence: each edge fires only when its condition holds.

| Chain | Pattern |
|-------|---------|
| `/preview` → `/ground` | A chosen direction that maps onto an account already in play, and whose intended inferences need an audit, is tagged at harvest for `/ground` |
| `/apportion` → `/conduct` | A taken unit plan leaves as a navigation block over its carrier; where the units' arrangement is itself unsettled, the person may conduct the method over it — the next move is theirs |
| `/ground` → `/conduct` | When `/ground` reads an abstraction against its own cases and summarizes that reading as a split into rival groups — a summary, not a verdict it computes — the per-group work goes to `/conduct` to be conducted |
| `/sublate` → `/inquire` / `/bound` | A missing pre-execution fact is routed to `/inquire`; a question a convention or ownership decision settles is routed to `/bound` |

## Multi-Protocol Sessions

| Pattern | Description |
|---------|-------------|
| Full workflow traversal | Several protocols in one session, e.g. inquire → apportion → contextualize → grasp (apportion slot *projected*; see the provenance caveat) |
| On-demand invocation | Protocols are independent tools — invoke whenever the need arises, not in prescribed order |
| Mid-session protocol switch | Start with one protocol, switch to another when a different deficit emerges |

## Invocation Techniques

| Technique | Example | Notes |
|-----------|---------|-------|
| Fully qualified name | `/aitesis:inquire` | Use `plugin:skill` format to target exact plugin when names overlap |

## Gate Interaction Engagement

| Pattern | Description |
|---------|-------------|
| Free-text depth | Typing custom text in "Other" often leads to deeper protocol engagement than selecting options |
| Challenge responses | Challenging a protocol's framing (e.g., "isn't /inquire better here?") triggers nuanced distinction explanations |
| Multi-paragraph input | Extended free-text responses with analysis and evidence — protocols accept and process any length |

## Non-Sequential Invocation

| Pattern | When |
|---------|------|
| `/grasp` mid-session | Verify understanding of partial results, not just final output |
| `/contextualize` after built-in `/simplify` | Chain epistemic protocol after built-in command |
| Skip the workflow | Jump directly to the protocol that matches your current deficit |

## Composition with Built-in Commands

| Chain | Pattern |
|-------|---------|
| `/simplify` → `/contextualize` | Simplify code, then check if simplified version fits deployment context |
| `/batch` → `/apportion` | Batch operations planned, then apportioned into units, each carrying one certificate of its compiled checks, accepted gaps, and reserved judgments, handed to the run with the authority granted before the person leaves (*projected*; see the provenance caveat) |
