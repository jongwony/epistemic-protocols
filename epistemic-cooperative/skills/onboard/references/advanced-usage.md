# Advanced Usage Patterns

Curated protocol usage patterns for Phase 6 Advanced Usage tips. Sourced from operational data across 1,100+ sessions over 15 days.

Provenance caveat: those sessions ran before `/apportion` existed. The rows marked *projected* that name it are projections onto the workflow slot a predecessor protocol occupied, carried forward because the slot is the same, and they are NOT observations under `/apportion`'s own contract — that predecessor compiled conditions for an already-bounded interval, while `/apportion` cuts a goal into units first. Read them as candidate chains until sessions under the current contract accumulate.

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
