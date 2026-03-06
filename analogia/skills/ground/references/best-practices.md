# Analogia Best Practices

Use `/ground` when the AI result is structurally plausible but you still need to verify how the abstraction maps to your actual context.

## User-Language Triggers

- "How does this apply to my case?"
- "Show me a concrete example in our system."
- "What does this pattern correspond to here?"
- "This sounds right in theory, but what maps to what in practice?"
- "Does this analogy still hold in our environment?"

## Best-Fit Scenarios

### Architecture pattern to real system

Use when AI names an architecture pattern correctly, but the team still needs to verify what each abstract component maps to in the existing system.

Example:
`/ground You described this as a Strangler Fig migration. Show what each part maps to in our monolith.`

### Abstract workflow to local process

Use when AI gives a generic framework and the uncertainty is not the framework itself, but how its pieces correspond to local roles, tools, or constraints.

Example:
`/ground This governance model sounds reasonable. What corresponds to approval, escalation, and audit in our actual workflow?`

### Concept transfer across domains

Use when AI transfers a concept from one domain to another and the risk is silent mismatch between source and target structures.

Example:
`/ground This caching analogy makes sense conceptually. Which concrete components in our data pipeline play each role?`

## Not The Best Fit

- Use `/frame` when the problem is choosing a lens, not grounding a chosen one.
- Use `/inquire` when the issue is missing execution context, not abstract-to-concrete correspondence.
- Use `/contextualize` when the result already exists and the concern is post-execution applicability, not structural mapping.
