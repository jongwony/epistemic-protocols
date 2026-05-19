# Adapter: higgsfield

Progressively disclosed — Read only after the `higgsfield` adapter is selected in Phase 0. Satisfies the Vendor Adapter Contract; the core never learns these specifics.

- **Modality**: video only. The `mcp__higgsfield__generate_image` deny stands; the adapter scopes to video models and does not project image prompts.
- **capabilities**: `mcp__higgsfield__models_explore` (`get` / `recommend`) for model constraints (resolution, duration, aspect ratio, required parameters). Do not reimplement; read constraints from the tool.
- **fetch_guide_snapshot**: canonical-external retrieval tagged `web:{url}` under the staleness guard. Higgsfield surfaces are blog/product-page based (not API docs), so the adapter resolves the guide at runtime by tavily search/extract scoped to the canonical video-guide coordinates below — progressive disclosure, not a static URL cache. Image-model guides are excluded (image generation is denied; video only). Canonical coordinates (video):
  - `https://higgsfield.ai/sora-2-prompt-guide`
  - `https://higgsfield.ai/blog/seedance-prompting-guide`
  - `https://higgsfield.ai/blog/Prompt-Guide-to-Cinematic-AI-Videos`
  - `https://higgsfield.ai/blog/How-to-guides` (hub)
- **derive_prompt_schema**: from the fetched guide snapshot, derive the model's prompt schema (the slots the video prompt must fill: subject, action/motion, camera, lighting, style, aspect ratio, duration, and model-specific blocks). The schema is runtime-derived from the guide, not hardcoded; staleness-guarded.
- **project**: derive the creative-media `CreativePromptIR` from the core `ResolvedIntentIR`, then render it through the derived schema into a `VendorPromptDraft` — a Higgsfield video prompt. Relay slots cited from the guide; constitution slots (model choice, mood intensity, camera move, duration vs guide max) carry a proposed default explicitly flagged.
- **validate**: check the draft against `capabilities` (`models_explore`); surface unsupported or degraded fields (e.g., duration beyond the model's max, unsupported aspect ratio).
- **InitialPrompt**: a Higgsfield video prompt for a follow-up session. `/forge` emits it and stops; it does not run `generate_video`.
