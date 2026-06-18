---
name: forge
description: "Reference-grounded initial-prompt formation. Reads a target reference document (vendor prompt guide, Codex Goals spec), surfaces the user's under-determined contract coordinates, and projects a ready-to-use initial prompt for a follow-up session or tool. Use when the user asks to 'forge a prompt', 'turn this guide into a usable prompt', 'make a Higgsfield prompt', 'draft a /goal from this', or has latent intent that must be grounded in an external reference before a tool can run it."
---

# Forge: Reference-Grounded Initial-Prompt Formation

Form a ready-to-use initial prompt by grounding the user's under-determined intent in an authoritative reference document. This skill does not run the downstream tool, open branches, or create PRs. It surfaces the user's intent coordinates, grounds them against a reference (dynamically fetched, staleness-guarded), and emits one initial prompt that bootstraps a follow-up session or tool invocation.

**This is a projection utility, not a runtime executor and not a protocol of its own.** Forge introduces no deficit *of its own*; it **realizes the Ektyposis `/realize` core deficit (ProjectionUnformed → RealizedArtifact) for the prompt family** — forge's projection step *is* Ektyposis's `project_structure_preserving`, specialized to prompt substrates. It composes the intent-resolution move (reverse-induction, the `/elicit` move) ∘ the reference-grounding move (the `/inquire` canonical-external move), then projects the resolved intent into a target prompt substrate's native artifact. The output is an `InitialPrompt` — the prompt-family `PromptArtifact` subtype of Ektyposis's `RealizedArtifact` — the user carries into the next session or tool.

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

- **Core (vendor-agnostic)**: reverse-induce the user's under-determined intent into `ResolvedIntentIR`; extract the adapter-derived required slots (`ContractElements`) the reference's schema requires; partition slots into relay vs constitution; own the staleness policy, provenance, and generic validation.
- **Vendor Adapter Contract (the seam)**: the narrow, parameterized interface every adapter satisfies. New references plug in by adding an adapter section — accumulated per real use, never built top-down.
- **Adapters (concrete instances)**: `Higgsfield`, `gpt-image`, `codex-goals`, and `claude-session` ship now. Each owns reference discovery/fetch, the reference's prompt schema, the projection rendering, and unsupported-field degradation.

### Vendor Adapter Contract (seam)

Each adapter provides, against a fixed contract:

| Seam operation | Meaning |
|---|---|
| `capabilities` | The reference's model/target constraints (resolution, duration, required fields, supported modalities). |
| `fetch_guide_snapshot` | Acquire the reference text via canonical-external retrieval — dynamic web fetch by default, or a local canonical mirror (a universally-deployed agent skill, an internal docs mirror, etc.) when the adapter binds to one. Produce a `GuideSnapshot` with staleness metadata. |
| `derive_prompt_schema` | From the snapshot, derive the reference's prompt schema (the slots the artifact must fill). |
| `project` | Render `ResolvedIntentIR` through the schema into a `VendorPromptDraft` (an adapter may first specialize it into a reference-specific IR such as `CreativePromptIR`). |
| `validate` | Check the draft against `capabilities`; surface degraded or unsupported fields. |

Narrowest seam contract: `ResolvedIntentIR × GuideSnapshot -> VendorPromptDraft`, carrying provenance and freshness. The core does not know "Seedance wants shot count first" or "a Goal needs a blocked-stop clause"; that lives in adapters.

**Functor framing (Ektyposis realization)**: each adapter's `project` (`ResolvedIntentIR × GuideSnapshot → VendorPromptDraft → InitialPrompt`) is a structure-preserving realization of Ektyposis's `project_structure_preserving` morphism for that vendor/substrate — it maps the resolved-intent structure into the reference's native prompt schema, preserving structure rather than substituting a template, and declares unsupported fields as degradation (`validate`'s `stale-guide` / `transport-unsafe` / degraded-field flags) rather than silently approximating them. The `InitialPrompt` it yields is the `PromptArtifact` subtype of Ektyposis's `RealizedArtifact`; the prompt substrate is itself dereferencing-and-capable, so forge realizes the prompt family directly rather than relaying to `/distill`.

## Types

| Type | Meaning |
|---|---|
| `ReferenceTarget` | The authoritative document to ground against: a vendor model prompt guide, the Codex Goals spec, or another reference the active adapter recognizes. |
| `ContractElements` | The reference-required slots forge extracts so the reference can be applied. The concrete slot set is adapter-derived from the reference's schema, not fixed by the core. |
| `ResolvedIntentIR` | The core's vendor-agnostic resolved-intent IR: the user's intent plus the resolved coordinates the reference's required slots need, modality-tagged but not media-specific. Core output stops here; an adapter may require a more specific specialization. |
| `CreativePromptIR` | An adapter-required specialization of `ResolvedIntentIR` for creative-media references (the Higgsfield-class adapter requires it): the modality-aware IR `{ intent{goal,audience?,mood?}, modality(image|video|audio|voice), scene?, visual?, motion?, audio?, params?, constraints{mustInclude?,mustAvoid?,references?} }`. Lossy-but-useful; preserves intent and common coordinates, not cross-reference semantic equivalence. The core never produces it; the creative-media adapter derives it from `ResolvedIntentIR`. |
| `GuideSnapshot` | The fetched reference text plus staleness metadata: `{ url, retrieved_at, visible_updated_at|version, content_hash, canonicality_score }`. |
| `RelaySlot` | A contract slot determined by the reference plus the user's stated intent. Forge auto-fills it with a cited basis. |
| `ConstitutionSlot` | A contract slot requiring the user's judgment. Forge fills it with a proposed default and explicitly flags it for recognition. |
| `VendorPromptDraft` | The adapter's projection of the IR through the reference schema, with provenance, freshness, a `stale-guide` flag when the staleness guard did not pass, and a `transport-unsafe` flag when the projected payload carries shell-active tokens or secret-substitution patterns hazardous across a shell-carrier handoff. |
| `InitialPrompt` | The endpoint artifact: an initial prompt for a follow-up session or tool — the `PromptArtifact` family, the prompt-substrate realization of Ektyposis's `RealizedArtifact`. Its form is adapter-determined (a Higgsfield video prompt; a Codex `/goal …` string). |

## Phase 0: Bind Reference and Intent

Bind two inputs:

- `ReferenceTarget` — an explicit reference (URL, vendor+model, "the Codex Goals doc"), or the reference the active adapter defaults to.
- The user's intent utterance — the latent, under-determined creative or task intent.

**Adapter selection (relay-first):** Select the adapter by relay when the reference or the user's request names or determines it — e.g., "/forge higgsfield: <intent>" or a Higgsfield model guide → `higgsfield`; "draft a /goal …" or the Codex Goals spec → `codex-goals`. Auto-include it; do not gate. Only when the adapter is genuinely ambiguous or unrecoverable, present the Adapter Index as a structured recognition choice (an AskUserQuestion over the indexed adapters) — never an unconditional prompt, never free-text, and never when relay determines the adapter. Do not guess the reference.

After the adapter is selected, Read `adapters/<selected>.md`. The full adapter contract is progressively disclosed — loaded only on selection, not before.

## Phase 1: Resolve Intent (Core — Reverse-Induction)

Reverse-induce the under-determined intent into `ResolvedIntentIR`. Surface only the coordinates the reference will require; do not interrogate coordinates the reference and stated intent already determine.

Use inline lightweight reverse-induction. When the intent carries heavy aporia (multi-axis, no stable coordinate basis), escalate to `/elicit` rather than forcing a thin IR, then resume Phase 2 with the resolved endpoint.

## Phase 2: Ground the Reference (Core — Canonical-External + Staleness)

Call the adapter's `fetch_guide_snapshot`: acquire the reference via canonical-external retrieval — dynamic web fetch by default, or a local canonical mirror when the adapter binds to one (a universally-deployed agent skill, an internal docs mirror, etc.). Default discovery is **hybrid** — a curated per-reference seed, resolved at runtime, accepted only if the staleness guard passes.

Staleness guard: record `{ url, retrieved_at, visible_updated_at|version, content_hash, canonicality_score }` and cross-check at least one of: a changelog/version page, a visible page date, an API model/version list, or a canonical docs index. For local canonical mirrors, the mirror file's mtime serves as `visible_updated_at` and a content hash (when applicable) as `content_hash`; cross-check is the source's own version field, or — if absent — the mtime against a known-good threshold. If stale or unverified, fall back to the curated seed and mark the draft `stale-guide`.

## Phase 3: Extract Contract and Partition Slots (Core)

Derive the reference's prompt schema and extract the adapter-derived required slots (`ContractElements`). Partition every slot:

- `RelaySlot` — determined by reference plus stated intent → fill with a cited basis.
- `ConstitutionSlot` — requires the user's judgment → fill with a proposed default, explicitly flagged.

Core output stops here at `ResolvedIntentIR` plus the partitioned slots and the validated `GroundedReference`.

## Phase 4: Project and Present (Adapter + Constitution)

The adapter projects the IR through the reference schema into a `VendorPromptDraft`, then `validate` checks it against `capabilities`.

Present a ready-to-use draft with **every contract slot filled**. Relay slots show their cited basis; constitution slots show the proposed default with an explicit recognition flag. Then surface the artifact as the `InitialPrompt` for the follow-up session/tool, with provenance, freshness, and any `stale-guide` or `transport-unsafe` flag.

Emit the `InitialPrompt` transport-safely (Rule 12): the payload is a **literal opaque artifact**, so display it verbatim (fenced) for on-screen reading, recommend file-based handoff over inline shell args for injection, and surface any `transport-unsafe` flag `validate` raised.

Surface — present the filled draft as context (slots, bases, flags) before the gate; the gate carries only:

1. **Accept** — use this initial prompt as-is in the follow-up session/tool.
2. **Adjust flagged slots** — change one or more constitution slots, then re-project.
3. **Regenerate** — re-fetch the reference or re-resolve intent and rebuild.

Default is the filled draft, not a bare question list.

## Adapter Index

Adapter bodies are progressively disclosed: this index is always loaded; each adapter's full contract lives in `adapters/<name>.md` and is Read only after the adapter is selected (Phase 0).

| Adapter | Reference | InitialPrompt form |
|---|---|---|
| `higgsfield` | Higgsfield video model prompt guide (video-only; image generation denied) | a Higgsfield video prompt for a follow-up session |
| `gpt-image` | Codex imagegen skill at `$CODEX_HOME/skills/.system/imagegen/` (image-only; targets `gpt-image-2`; web cookbook fallback) | a `gpt-image-2` prompt block (using the source's shared schema) plus parameter envelope |
| `codex-goals` | OpenAI Codex Goals specification | a strong `/goal …` string for a follow-up Codex session |
| `claude-session` | Claude prompting best-practices guide (model-axis: `prompting-claude-{model}`; first-party, reflexive) | a model-tailored handoff initial-prompt for a follow-up Claude session (`/remote-spawn` worktree or remote-control) |
| `dia` | Dia browser (The Browser Company) custom-skill surface — a conditioning instruction over page/selection/tab context; encrypted/cloud-synced store, no file/CLI/deeplink import | a paste-ready Dia custom-skill recipe (`DiaRecipeInstruction`: name + description + body) projected from a `ProtocolEssenceIR`, with an `UnavailableInDia` degradation ledger; the fullest forge realization of the Ektyposis `/realize` morphism |

Each adapter file satisfies the Vendor Adapter Contract (`capabilities` / `fetch_guide_snapshot` / `derive_prompt_schema` / `project` / `validate`). New references plug in by adding an `adapters/<name>.md` file as accumulated prior — see Deferred Colimit; do not pre-build a registration framework.

## Rules

1. **No deficit of its own; realizes Ektyposis** (Architectural — role boundary): forge is a projection utility, not a protocol. It names no deficit→resolution morphism *of its own*; instead it **realizes the Ektyposis `/realize` deficit (ProjectionUnformed → RealizedArtifact) for the prompt family** — forge's projection step is identified with Ektyposis's `project_structure_preserving`, specialized to prompt substrates. It composes the `/elicit` and `/inquire` canonical-external moves and projects; the epistemic deficit it discharges is Ektyposis's, not a new one. forge remains a utility, not a protocol.
2. **Core stops at IR** (Architectural — boundary invariant): core output is `ResolvedIntentIR` plus the validated grounded reference. The artifact form is adapter-determined and must not be promoted to a core output type. Promoting a completion-contract form into the core re-imports the routable/provenance boundary that a separate research issue owns; keep contract-ness in the adapter.
3. **Initial-prompt endpoint = PromptArtifact** (Architectural — handoff specificity): every adapter's projection endpoint is an initial prompt for a follow-up session or tool — the **`PromptArtifact`** family, the prompt-substrate realization of Ektyposis's `RealizedArtifact` (with `InitialPrompt` its follow-up-session form). This is a unifying role, not a shared output type: the real per-adapter forms remain those in the Adapter Index "InitialPrompt form" column.
4. **Reference grounding required** (Axiom anchor — Detection with Authority): every projection grounds against a fetched reference with cited provenance. A projection without a grounded, provenance-tagged reference is not a forge output.
5. **Recognition over Recall** (Axiom anchor — Recognition over Recall): forge emits a filled draft, not a blank question list. Relay slots are auto-filled with cited basis; constitution slots carry a proposed default explicitly flagged so the user recognizes and adjusts rather than recalls from blank.
6. **Surfacing over Deciding** (Derived — Surfacing over Deciding): constitution slots are surfaced with their proposed defaults flagged; forge does not silently finalize a slot that requires the user's judgment. A blind full draft that hides which slots were guessed is an anti-pattern.
7. **Context-Question Separation** (Axiom anchor — Context-Question Separation): the filled draft, slot bases, and flags are presented as text before the gate. The gate carries only Accept / Adjust flagged slots / Regenerate.
8. **Staleness guard** (Architectural — provenance continuity): reference evidence is staleness-guarded and tagged `web:{url}` or `file:{path}` depending on the canonical-source substrate. If staleness cannot be verified, fall back to the curated seed and mark the draft `stale-guide`; never present a stale reference silently.
9. **Adapter accumulation, not top-down** (Architectural — empirical restraint): adapters are added per real use as accumulated prior. The Adapter Index above is the authoritative list of currently-shipped adapters; do not build a multi-reference framework ahead of use.
10. **Formation, not execution** (Architectural — role boundary): `/forge` does not run the downstream tool, create branches, or open PRs. It emits the initial prompt and stops.
11. **Progressive-disclosure adapters** (Architectural — context economy + accumulation): adapter bodies are isolated `adapters/<name>.md` files loaded only after selection; the always-loaded Adapter Index carries name + reference + InitialPrompt form. Selection is relay when the reference or request determines the adapter, a structured recognition gate only on genuine ambiguity (never unconditional). Adapters accumulate as additive files — the deferred-colimit accumulation mechanism made physical; do not build a generalized adapter-registration framework ahead of use.
12. **Transport-safe handoff** (Architectural — handoff boundary): the `InitialPrompt` is a literal opaque payload that crosses transport boundaries the projection does not control — a markdown terminal render, a shell argument, a paste buffer. Display it **verbatim** (fenced) so document XML tags and special characters survive on-screen rendering instead of being interpreted as HTML and truncated. For injection into a shell carrier, recommend **file-based handoff** (Write the payload, the carrier reads the file) over inline shell args: `` ` ``, `$(`, and `${` undergo shell substitution and `'` can break out of a quoted argument, so a literal `$(…)` secret-fetch in the payload would execute and leak. A shell-carrier adapter's `validate` raises `transport-unsafe` when the payload carries such tokens — currently realized in `claude-session`, with other shell-carrier adapters adding the scan as they accumulate (Rule 9); never present a `transport-unsafe` payload for inline injection silently.

## Deferred Colimit (do not extract yet)

The cross-adapter abstraction — "reference-grounded initial-prompt formation" generalized over reference classes — is a **deliberately deferred colimit**. Its structure is a prescriptive core plus per-instance realizations plus accumulated prior. It is **not** extracted or named now.

Trigger to extract the meta-pattern: a built first-reference instance plus accumulated prior from real use of a second instance, per the epistemic cost asymmetry (an unused abstraction costs more than a missing one) and instance-first methodology. Naming it before that is the over-generalization the methodology refuses.

Candidate adapters (not yet realized — list only, do not build ahead of use):

- `cookbook-conformer` — ground intent against a cookbook/recipe reference.
- `best-practices-conformer` — ground intent against a best-practices document.
- additional vendor model-guide adapters as real use accumulates.

## Boundary Note

`/forge` forms an initial prompt and stops. It reads a reference and surfaces intent; it does not execute the tool, run the Goal, generate the media, or open branches/PRs. Heavy intent aporia routes to `/elicit`; the reference-fetch move mirrors the `/inquire` canonical-external channel but forge owns the projection.

## Operational checklist (per cycle)

- [ ] Phase 0 reference and intent bound; adapter selected by relay (structured recognition gate only on ambiguity); `adapters/<selected>.md` Read only after selection
- [ ] Phase 1 intent reverse-induced into `ResolvedIntentIR`; heavy aporia escalated to `/elicit`
- [ ] Phase 2 reference fetched with staleness metadata; hybrid seed + dynamic fetch + guard applied
- [ ] Phase 3 adapter-derived required slots extracted; every slot partitioned relay vs constitution
- [ ] Phase 4 filled draft presented — relay slots cited, constitution slots flagged
- [ ] InitialPrompt emitted with provenance, freshness, and `stale-guide` flag when applicable
- [ ] InitialPrompt displayed verbatim and emitted transport-safely — file-based handoff recommended over inline shell args; `transport-unsafe` flag surfaced when applicable
- [ ] Core output stopped at IR; artifact form kept in the adapter
- [ ] No tool execution, branch, or PR performed
