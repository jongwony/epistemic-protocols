# Adapter: codex-goals

Progressively disclosed — Read only after the `codex-goals` adapter is selected in Phase 0. Satisfies the Vendor Adapter Contract; the core never learns these specifics.

- **Reference**: the OpenAI Codex Goals specification — a strong Goal defines the six contract elements (outcome, verification surface, constraints, boundaries, iteration policy, blocked condition).
- **capabilities**: the Goal contract surface — what a strong `/goal` admits (a verifiable end state, an evidence/verification surface, constraints, allowed inputs/boundaries, an inter-iteration policy, a blocked-stop condition). No external capability API; the contract is the constraint set.
- **fetch_guide_snapshot**: canonical-external web fetch of the Codex Goals doc with the staleness guard. The Codex Goals doc is a dated/versioned developer reference, so the staleness guard typically passes cleanly (contrast: the blog-based Higgsfield surfaces).
- **derive_prompt_schema**: the six-element Goal contract — outcome, verification surface, constraints, boundaries, iteration policy, blocked condition.
- **project**: render `CreativePromptIR` through the six-element schema into a `VendorPromptDraft` — a strong `/goal …` string following: `<desired end state> verified by <evidence> while preserving <constraints>. Use <allowed inputs>. Between iterations <next-action policy>. If blocked <report + unlock>.` Relay slots (iteration policy, blocked-condition shape — prescribed by the doc) cited; constitution slots (verification surface, constraints, budget) carry a proposed default explicitly flagged. Per the doc's own discipline, surface only genuinely necessary missing detail.
- **validate**: check the draft expresses all six elements and that the end state is verifiable (not "make it better"); surface any element left underspecified.
- **InitialPrompt**: a strong `/goal …` string for a follow-up Codex session. `/forge` emits it and stops; it does not run the Goal.
