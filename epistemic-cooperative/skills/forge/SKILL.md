---
name: forge
description: "Reference-grounded initial-prompt formation. Reads a target reference document (vendor prompt guide, Codex Goals spec), surfaces the user's under-determined contract coordinates, and projects a ready-to-use initial prompt for a follow-up session or tool. Use when the user asks to 'forge a prompt', 'turn this guide into a usable prompt', 'make a Higgsfield prompt', 'draft a /goal from this', or has latent intent that must be grounded in an external reference before a tool can run it."
---

# Forge: Reference-Grounded Initial-Prompt Formation

Form a ready-to-use initial prompt by grounding the user's under-determined intent in an authoritative reference document. This skill does not run the downstream tool, open branches, or create PRs. It surfaces the user's intent coordinates, grounds them against a reference (dynamically fetched, staleness-guarded), and emits one initial prompt that bootstraps a follow-up session or tool invocation.

**This is a projection utility, not a runtime executor and not a new epistemic protocol.** Forge introduces no new deficit. It realizes a known composite — surface under-determined intent coordinates (reverse-induction, the `/elicit` move) ∘ ground them against a canonical external reference (the `/inquire` canonical-external move) → thin projection. The output is an initial prompt the user carries into the next session or tool.

## Core Contract

`/forge` owns reference-grounded initial-prompt formation:

```
ReferenceIntake
  -> ResolvedIntentIR        (core: reverse-induce under-determined coordinates)
  -> GroundedReference       (core: canonical-external snapshot + staleness guard)
  -> VendorPromptDraft       (adapter: project IR through the reference schema)
  -> InitialPrompt           (adapter: initial prompt for a follow-up session/tool)
```

The **core** is vendor-agnostic and stops at `ResolvedIntentIR` plus the validated `GroundedReference`. The **adapter** owns the projection into a vendor-native artifact form. The core never learns vendor specifics; the adapter never re-derives intent.

## Core / Seam / Adapter

- **Core (vendor-agnostic)**: reverse-induce the user's under-determined intent into `CreativePromptIR`; extract the six contract elements the reference requires; partition slots into relay vs constitution; own the staleness policy, provenance, and generic validation.
- **Vendor Adapter Contract (the seam)**: the narrow, parameterized interface every adapter satisfies. New references plug in by adding an adapter section — accumulated per real use, never built top-down.
- **Adapters (concrete instances)**: `Higgsfield` and `codex-goals` ship now. Each owns reference discovery/fetch, the reference's prompt schema, the projection rendering, and unsupported-field degradation.

### Vendor Adapter Contract (seam)

Each adapter provides, against a fixed contract:

| Seam operation | Meaning |
|---|---|
| `capabilities` | The reference's model/target constraints (resolution, duration, required fields, supported modalities). |
| `fetch_guide_snapshot` | Acquire the reference text via canonical-external dynamic web fetch; produce a `GuideSnapshot` with staleness metadata. |
| `derive_prompt_schema` | From the snapshot, derive the reference's prompt schema (the slots the artifact must fill). |
| `project` | Render `CreativePromptIR` through the schema into a `VendorPromptDraft`. |
| `validate` | Check the draft against `capabilities`; surface degraded or unsupported fields. |

Narrowest seam contract: `CreativePromptIR × GuideSnapshot -> VendorPromptDraft`, carrying provenance and freshness. The core does not know "Seedance wants shot count first" or "a Goal needs a blocked-stop clause"; that lives in adapters.

## Types

| Type | Meaning |
|---|---|
| `ReferenceTarget` | The authoritative document to ground against: a vendor model prompt guide, the Codex Goals spec, or another reference the active adapter recognizes. |
| `ContractElements` | The six elements forge extracts that a reference requires to be applied: outcome, verification surface, constraints, boundaries, iteration policy, blocked condition. |
| `CreativePromptIR` | The modality-aware intermediate representation of resolved intent: `{ intent{goal,audience?,mood?}, modality(image|video|audio|voice), scene?, visual?, motion?, audio?, params?, constraints{mustInclude?,mustAvoid?,references?} }`. Lossy-but-useful; it preserves intent and common coordinates, not cross-reference semantic equivalence. |
| `GuideSnapshot` | The fetched reference text plus staleness metadata: `{ url, retrieved_at, visible_updated_at|version, content_hash, canonicality_score }`. |
| `RelaySlot` | A contract slot determined by the reference plus the user's stated intent. Forge auto-fills it with a cited basis. |
| `ConstitutionSlot` | A contract slot requiring the user's judgment. Forge fills it with a proposed default and explicitly flags it for recognition. |
| `VendorPromptDraft` | The adapter's projection of the IR through the reference schema, with provenance, freshness, and a `stale-guide` flag when the staleness guard did not pass. |
| `InitialPrompt` | The endpoint artifact: an initial prompt for a follow-up session or tool. Its form is adapter-determined (a Higgsfield video prompt; a Codex `/goal …` string). |

## Phase 0: Bind Reference and Intent

Bind two inputs:

- `ReferenceTarget` — an explicit reference (URL, vendor+model, "the Codex Goals doc"), or the reference the active adapter defaults to.
- The user's intent utterance — the latent, under-determined creative or task intent.

Select the adapter from the reference (Higgsfield model guide → Higgsfield adapter; Codex Goals / strong-`/goal` request → codex-goals adapter). If neither the reference nor an adapter is recoverable, ask for the reference and intent. Do not guess the reference.

## Phase 1: Resolve Intent (Core — Reverse-Induction)

Reverse-induce the under-determined intent into `CreativePromptIR`. Surface only the coordinates the reference will require; do not interrogate coordinates the reference and stated intent already determine.

Use inline lightweight reverse-induction. When the intent carries heavy aporia (multi-axis, no stable coordinate basis), escalate to `/elicit` rather than forcing a thin IR, then resume Phase 2 with the resolved endpoint.

## Phase 2: Ground the Reference (Core — Canonical-External + Staleness)

Call the adapter's `fetch_guide_snapshot`: acquire the reference via canonical-external dynamic web fetch. Default discovery is **hybrid** — a curated per-reference seed, fetched at runtime, accepted only if the staleness guard passes.

Staleness guard: record `{ url, retrieved_at, visible_updated_at|version, content_hash, canonicality_score }` and cross-check at least one of: a changelog/version page, a visible page date, an API model/version list, or a canonical docs index. If stale or unverified, fall back to the curated seed and mark the draft `stale-guide`.

## Phase 3: Extract Contract and Partition Slots (Core)

Derive the reference's prompt schema and extract the six `ContractElements`. Partition every slot:

- `RelaySlot` — determined by reference plus stated intent → fill with a cited basis.
- `ConstitutionSlot` — requires the user's judgment → fill with a proposed default, explicitly flagged.

Core output stops here at `ResolvedIntentIR` plus the partitioned slots and the validated `GroundedReference`.

## Phase 4: Project and Present (Adapter + Constitution)

The adapter projects the IR through the reference schema into a `VendorPromptDraft`, then `validate` checks it against `capabilities`.

Present a ready-to-use draft with **every contract slot filled**. Relay slots show their cited basis; constitution slots show the proposed default with an explicit recognition flag. Then surface the artifact as the `InitialPrompt` for the follow-up session/tool, with provenance, freshness, and any `stale-guide` flag.

Surface — present the filled draft as context (slots, bases, flags) before the gate; the gate carries only:

1. **Accept** — use this initial prompt as-is in the follow-up session/tool.
2. **Adjust flagged slots** — change one or more constitution slots, then re-project.
3. **Regenerate** — re-fetch the reference or re-resolve intent and rebuild.

`--ask-only` is an opt-in mode: emit only the surfaced contract slots as recognition questions and stop before projection. Default is the filled draft, not a bare question list.

## Adapter: Higgsfield

- **Modality**: video only. The `mcp__higgsfield__generate_image` deny stands; the adapter scopes to video models and does not project image prompts.
- **capabilities**: `mcp__higgsfield__models_explore` (`get` / `recommend`) for model constraints (resolution, duration, aspect, required parameters). Do not reimplement.
- **fetch_guide_snapshot**: canonical-external web fetch tagged `web:{url}` with the staleness guard. Curated seed (per model/use):
  - `higgsfield.ai/sora-2-prompt-guide`
  - `higgsfield.ai/nano-banana-pro-prompt-guide`
  - `higgsfield.ai/blog/seedance-prompting-guide`
  - `higgsfield.ai/blog/Prompt-Guide-to-Cinematic-AI-Videos`
  - `higgsfield.ai/blog/How-to-guides` (hub)
  - Higgsfield surfaces are blog/product-page based, not API docs; strong canonical seeding is required.
- **InitialPrompt**: a Higgsfield video prompt for a follow-up session.

## Adapter: codex-goals

- **Reference**: the OpenAI Codex Goals specification — a strong Goal defines the six contract elements (outcome, verification surface, constraints, boundaries, iteration policy, blocked condition).
- **fetch_guide_snapshot**: canonical-external web fetch of the Codex Goals doc with the staleness guard.
- **derive_prompt_schema**: the six-element Goal contract.
- **InitialPrompt**: a strong `/goal …` string for a follow-up Codex session, following `<desired end state> verified by <evidence> while preserving <constraints>. Use <allowed inputs>. Between iterations <next-action policy>. If blocked <report + unlock>.`

## Rules

1. **No new deficit** (Architectural — role boundary): forge is a projection utility, not a protocol. It introduces no deficit→resolution morphism. It composes the `/elicit` and `/inquire` canonical-external moves and projects; it does not name a new epistemic deficit.
2. **Core stops at IR** (Architectural — boundary invariant): core output is `ResolvedIntentIR` plus the validated grounded reference. The artifact form is adapter-determined and must not be promoted to a core output type. Promoting a completion-contract form into the core re-imports the routable/provenance boundary that a separate research issue owns; keep contract-ness in the adapter.
3. **Initial-prompt endpoint** (Architectural — handoff specificity): every adapter's projection endpoint is an initial prompt for a follow-up session or tool. This is a unifying role, not a shared output type.
4. **Reference grounding required** (Axiom anchor — Detection with Authority): every projection grounds against a fetched reference with cited provenance. A projection without a grounded, provenance-tagged reference is not a forge output.
5. **Recognition over Recall** (Axiom anchor — Recognition over Recall): forge emits a filled draft, not a blank question list. Relay slots are auto-filled with cited basis; constitution slots carry a proposed default explicitly flagged so the user recognizes and adjusts rather than recalls from blank.
6. **Surfacing over Deciding** (Derived — Surfacing over Deciding): constitution slots are surfaced with their proposed defaults flagged; forge does not silently finalize a slot that requires the user's judgment. A blind full draft that hides which slots were guessed is an anti-pattern.
7. **Context-Question Separation** (Axiom anchor — Context-Question Separation): the filled draft, slot bases, and flags are presented as text before the gate. The gate carries only Accept / Adjust flagged slots / Regenerate.
8. **Staleness guard** (Architectural — provenance continuity): reference evidence is staleness-guarded and tagged `web:{url}`. If staleness cannot be verified, fall back to the curated seed and mark the draft `stale-guide`; never present a stale reference silently.
9. **Adapter accumulation, not top-down** (Architectural — empirical restraint): adapters are added per real use as accumulated prior. Forge ships exactly the Higgsfield and codex-goals adapters; do not build a multi-reference framework ahead of use.
10. **Formation, not execution** (Architectural — role boundary): `/forge` does not run the downstream tool, create branches, or open PRs. It emits the initial prompt and stops.

## Deferred Colimit (do not extract yet)

The cross-adapter abstraction — "reference-grounded initial-prompt formation" generalized over reference classes — is a **deliberately deferred colimit**. It is a sibling of the `triage-gated-vendor-harness` meta-pattern (a prescriptive core + per-instance realizations + accumulated prior). It is **not** extracted or named now.

Trigger to extract the meta-pattern: a built first-reference instance plus accumulated prior from real use of a second instance, per the epistemic cost asymmetry (an unused abstraction costs more than a missing one) and instance-first methodology. Naming it before that is the over-generalization the methodology refuses.

Candidate adapters (not yet realized — list only, do not build ahead of use):

- `cookbook-conformer` — ground intent against a cookbook/recipe reference.
- `best-practices-conformer` — ground intent against a best-practices document.
- additional vendor model-guide adapters as real use accumulates.

## Boundary Note

`/forge` forms an initial prompt and stops. It reads a reference and surfaces intent; it does not execute the tool, run the Goal, generate the media, or open branches/PRs. Heavy intent aporia routes to `/elicit`; the reference-fetch move mirrors the `/inquire` canonical-external channel but forge owns the projection.

## Anti-patterns

- **Blank question list**: emitting the six contract elements as open questions instead of a filled draft with flagged slots.
- **Blind full draft**: emitting a confident artifact that hides which slots were guessed (constitution slots must be flagged).
- **Core promotion**: making "completion contract" or any adapter artifact form a core output type instead of an adapter projection.
- **Silent stale reference**: presenting a fetched reference without the staleness guard or `stale-guide` flag.
- **Top-down adapter framework**: building a multi-reference abstraction ahead of accumulated use, or naming the deferred colimit prematurely.
- **Reference-free projection**: emitting a prompt not grounded in a fetched, provenance-tagged reference.
- **Execution leakage**: running the tool, the Goal, or media generation inside `/forge`.

## Operational checklist (per cycle)

- [ ] Phase 0 reference and intent are bound; the adapter is selected from the reference
- [ ] Phase 1 intent reverse-induced into `CreativePromptIR`; heavy aporia escalated to `/elicit`
- [ ] Phase 2 reference fetched with staleness metadata; hybrid seed + dynamic fetch + guard applied
- [ ] Phase 3 six contract elements extracted; every slot partitioned relay vs constitution
- [ ] Phase 4 filled draft presented — relay slots cited, constitution slots flagged
- [ ] InitialPrompt emitted with provenance, freshness, and `stale-guide` flag when applicable
- [ ] Core output stopped at IR; artifact form kept in the adapter
- [ ] No tool execution, branch, or PR performed
