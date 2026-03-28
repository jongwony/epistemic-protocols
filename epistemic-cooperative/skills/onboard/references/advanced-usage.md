# Advanced Usage Patterns

Curated protocol usage patterns for Phase 6 Advanced Usage tips. Sourced from operational data across 1,100+ sessions over 15 days.

## Protocol Chaining

Protocols whose output naturally feeds into the next. These are observed chains, not prescribed sequences.

| Chain | Frequency | Pattern |
|-------|-----------|---------|
| `/clarify` → `/goal` | Common | Clarify resolves expression ambiguity → Goal co-constructs success criteria from the clarified intent |
| `/inquire` → `/gap` | Common | Inquire gathers missing context → Gap audits the decision now that context is complete |
| `/clarify` → `/attend` → `/gap` | Observed | Clarify a failed protocol → re-execute it → gap-audit the resulting design |
| `/inquire` → `/gap` → `/attend` | Observed | Three-step pre-execution: context → decision audit → risk classification |
| `/dashboard` → `/inquire` → `/attend` | Observed | Analytics surface a question → inquire about it → risk-evaluate the conclusion |

## Multi-Protocol Sessions

| Pattern | Description |
|---------|-------------|
| Full workflow traversal | Up to 8 protocols in one session: inquire → clarify → attend → contextualize → grasp |
| On-demand invocation | Protocols are independent tools — invoke whenever the need arises, not in prescribed order |
| Mid-session protocol switch | Start with one protocol, switch to another when a different deficit emerges |

## Invocation Techniques

| Technique | Example | Notes |
|-----------|---------|-------|
| Context passing | `/clarify fix the auth flow` | Protocol receives your text as input args |
| Fully qualified name | `/aitesis:inquire` | Use `plugin:skill` format to target exact plugin when names overlap |
| Plan mode | `/clarify` in plan mode | Protocols work because they primarily use gate interaction, which is allowed in plan mode |

## Gate Interaction Engagement

| Pattern | Description |
|---------|-------------|
| Free-text depth | Typing custom text in "Other" often leads to deeper protocol engagement than selecting options |
| Challenge responses | Challenging a protocol's framing (e.g., "isn't /frame better here?") triggers nuanced distinction explanations |
| Multi-paragraph input | Extended free-text responses with analysis and evidence — protocols accept and process any length |

## Non-Sequential Invocation

| Pattern | When |
|---------|------|
| `/gap` before `/clarify` | You sense blind spots before articulating intent |
| `/grasp` mid-session | Verify understanding of partial results, not just final output |
| `/contextualize` after built-in `/simplify` | Chain epistemic protocol after built-in command |
| Skip the workflow | Jump directly to the protocol that matches your current deficit |

## Experience Enhancement

| Enhancement | How | Notes |
|-------------|-----|-------|
| Epistemic Ink Output Style | Run `/config` to enable | Structured formatting for protocol interactions — richer gate presentation, visual phase markers |
| Output Style stacking | Enable multiple styles in `/config` | Epistemic Ink composes with other Output Styles without conflict |

## Composition with Built-in Commands

| Chain | Pattern |
|-------|---------|
| `/simplify` → `/contextualize` | Simplify code, then check if simplified version fits deployment context |
| `/batch` → `/attend` | Batch operations planned, then execute with risk-aware gating |
| Any built-in → `/gap` | After any execution, audit for overlooked gaps |
