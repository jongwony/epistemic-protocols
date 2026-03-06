# Advanced Usage Patterns

Curated protocol usage patterns for Phase 7 Advanced Usage tips. Sourced from operational data across 1,100+ sessions over 15 days.

## Protocol Chaining

Protocols whose output naturally feeds into the next. These are observed chains, not prescribed sequences.

| Chain | Frequency | Pattern |
|-------|-----------|---------|
| `/frame` → `/calibrate` | Most common | Frame produces findings with severity levels → Calibrate sets delegation scope for which findings the user fixes vs. AI fixes |
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
| Plan mode | `/calibrate` in plan mode | Protocols work because they primarily use AskUserQuestion, which is allowed in plan mode |

## AskUserQuestion Engagement

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

## Composition with Built-in Commands

| Chain | Pattern |
|-------|---------|
| `/simplify` → `/contextualize` | Simplify code, then check if simplified version fits deployment context |
| `/batch` → `/attend` | Batch operations planned, then risk-classify before execution |
| Any built-in → `/gap` | After any execution, audit for overlooked gaps |
