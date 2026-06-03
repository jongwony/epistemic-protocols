---
name: image-companion
description: >-
  A symbolic slide image for a document passage, consistent with the artifact's companion
  images. Use when the user wants a diagram or visual symbol for a section.
  Composes /forge + Codex.
skills:
  - epistemic-cooperative:forge
---

# Image Companion

Invoke with `/image-companion` (or whenever the user wants a slide-ready image for a
passage in a document they are working on).

Supply images that **belong to one artifact**. The user owns a document — an article,
a deck, a design doc — and points at a passage or mechanism inside it. Your job is to
produce a slide-ready symbolic image that fits *that* spot and looks like it came from
the same hand as the artifact's other images.

This is not a one-shot "make an image" tool. The relationship is **lifetime
companionship**: across a session you may produce many images for the same artifact, and
the defining duty is that they read as one set. Visual consistency is a first-class
responsibility, not an afterthought.

You orchestrate two existing skills and add the human-judgment and quality layers around
them. Delegate grounding to /forge and generation to the Codex CLI; your own role is the
metaphor design, the human gate, verification, and series coherence.

```
bind artifact + passage
  → (recommended) metaphor preview gate   ← human picks the visual idea cheaply
  → /forge   (grounding + gpt-image prompt block)        [DELEGATE]
  → Codex CLI   (gpt-image-2 generation)                 [DELEGATE]
  → verify + enforce series coherence + report
```

## Step 0 — Bind the artifact and the target

Read the artifact passage the user is pointing at. Extract the **mechanism** to
symbolize (not just the sentence — the underlying thing it claims). This is per-call
data; nothing here is fixed.

Then locate the **companion set**: other images already made for this artifact (same
output directory, or earlier in this session). Their palette, tone, and text rules are
the consistency contract for the new image. If this is the first image, you are
*establishing* the contract — record the choices so later calls inherit them.

Carry the design-tone context forward by continuing in the same session. Compaction
preserves it; that is how series coherence survives a long-running artifact.

## Step 1 — Metaphor preview gate (recommended, not required)

Image generation costs real time and money. Before spending it, agree on the visual
idea in plain text. This step is **recommended** — skip it only when the user has
already named the exact metaphor.

1. Design 2–3 candidate metaphors for the mechanism. Keep them free of domain jargon
   (no SQL/JOIN/INNER/OUTER, no internal API names *in the image*) so an all-hands
   audience reads them at a glance.
2. Sketch each candidate as small **ASCII art** and put it in the `preview` field of an
   `AskUserQuestion` option, so the user compares the *ideas* in the terminal before any
   pixels are generated.
3. In the same gate, ask the **loss-depiction depth** when the passage describes a
   failure/loss: neutral (mechanism only) vs. show-through-to-the-loss (depict the bad
   outcome). This choice changes the image's punchline.

The ASCII preview is a cheap proxy that has repeatedly de-risked the expensive step —
treat it as the default, but don't force it on a user who already knows what they want.

## Step 2 — Structure the initial prompt with /forge

Invoke `epistemic-cooperative:forge` with the **gpt-image adapter**. Forge's job here is
not just to "write a prompt" — it is to **structure the initial prompt so that the
character extracted from the artifact is preserved**. Two things make up that character:
the grounded essence of the passage (what the mechanism actually claims) and the
companion set's identity (palette, tone, text rules). Forge encodes both into the
structured prompt, so the prompt block itself becomes the carrier of artifact fidelity —
not something checked back in afterward.

Forge owns the reference grounding and fills the `infographic-diagram` prompt schema (Use
case / Asset type / Primary request / Scene / Subject / Style / Composition / Lighting /
Color palette / Text verbatim / Constraints / Avoid). Hand it: the artifact passage, the
chosen metaphor, the loss-depth decision, and the house-style constraints from
`references/house-style.md` (Step 0's companion-set reading is what makes those
constraints concrete). You do not write the schema yourself — forge does.

## Step 3 — Generate via Codex CLI

Call the Codex CLI directly, in the same form as `/review-ensemble` and `/goal-research`.
This runs gpt-image-2 generation as an independent model call.

Check `which codex 2>/dev/null`. If the Codex CLI is not found, surface the
missing-binary error and stop — failure modes are raw errors, not handled internally.

Generate a unique suffix: `SUFFIX=$(openssl rand -hex 4)`. Write forge's prompt block to
`/tmp/image_companion_${SUFFIX}.txt`. The prompt MUST be English and MUST include the
`$imagegen` marker so Codex engages image generation.

Launch via `Bash(run_in_background: true, timeout: 600000)`, with `--cd` pointing at the
artifact's image directory so the PNG lands beside its companions:

```bash
EVENTS_JSONL=/tmp/image_companion_events_${SUFFIX}.jsonl
codex exec --ephemeral --json --skip-git-repo-check -m gpt-5.5 \
  --config model_reasoning_effort="medium" \
  --sandbox workspace-write \
  --cd <artifact-image-dir> \
  < /tmp/image_companion_${SUFFIX}.txt > "$EVENTS_JSONL" 2>&1
```

For multiple images, launch one background call per image in the same turn so they run in
parallel — each with its own `${SUFFIX}`, hence its own `$EVENTS_JSONL`, so parallel streams
never collide. Each completion sends a notification — then read that call's `$EVENTS_JSONL`
and `rm -f /tmp/image_companion_${SUFFIX}.txt /tmp/image_companion_events_${SUFFIX}.jsonl` (literal
paths — `$EVENTS_JSONL` does not survive into a separate cleanup Bash call). Wait for the completion
notification before reading output.

On completion the JSONL event stream is already in `$EVENTS_JSONL` (redirected at launch).
With `--json` it is a **JSONL event stream possibly interleaved with a non-JSON stderr
banner**, not free text. Extract the codex `agent_message` narrative verbatim with the line
below. Forward that narrative verbatim to Step 4 — the PNG-confirmation and any in-message
warnings you surface there are read from this narrative, not regex-parsed:

```bash
# Codex --json event stream → agent_message narrative, verbatim. Extract per the JSONL
# schema in use: item.completed events whose item.type is agent_message carry text at .item.text.
# -R fromjson? skips non-JSON lines (the stderr banner interleaved into the captured stdout+stderr).
# All agent_message items in stream order; no tail. The downstream step reads the narrative.
# Restate the path: shell vars do NOT persist across separate Bash calls — re-derive from ${SUFFIX}.
EVENTS_JSONL=/tmp/image_companion_events_${SUFFIX}.jsonl
NARRATIVE=$(jq -rR 'fromjson? | select(.type=="item.completed" and .item.type=="agent_message") | .item.text' "$EVENTS_JSONL")
if [ -z "$NARRATIVE" ]; then
  # codex failed before emitting agent_message: surface the raw stream for diagnosis and FAIL the block
  # (exit 1) so a blank narrative cannot be reported as a successful generation.
  echo "Codex produced no agent_message — raw event stream follows:" >&2
  cat "$EVENTS_JSONL" >&2
  exit 1
fi
printf '%s\n' "$NARRATIVE"
```

Some codex warnings (e.g. `invalid_grant` auth-token failures, `--full-auto` deprecation)
appear on the **non-JSON stderr banner lines** rather than inside `agent_message`. So
ALSO grep the raw captured file for those warning strings, to catch what the narrative
does not carry:

```bash
# Warnings that live on the non-JSON banner lines, not in agent_message.
# Restate the path (shell vars do NOT persist across separate Bash calls), then guard file existence
# first: a missing/empty $EVENTS_JSONL is a capture failure (diagnose it), NOT "no warnings" —
# `|| true` alone would mask grep's exit-2 file-not-found as a clean scan.
EVENTS_JSONL=/tmp/image_companion_events_${SUFFIX}.jsonl
if [ ! -s "$EVENTS_JSONL" ]; then
  echo "WARNING: \$EVENTS_JSONL missing or empty — codex capture failed; treat as a diagnostic failure, not 'no warnings'." >&2
else
  grep -iE 'invalid_grant|deprecat|--full-auto|warn' "$EVENTS_JSONL" || true
fi
```

Reasoning items appear only if codex emits them (config-gated) — do not force them on.

Running in the background keeps Codex's verbose banner out of the main context. The model
(`-m gpt-5.5`) is fixed by design — Codex substitutes its own internal image skill
targeting gpt-image-2, so the model is structural, not a quality knob (see
`references/house-style.md`). Note: `--ephemeral` means there is no resumable session — a
correction is a fresh run with a corrective prompt, not a session resume.

## Step 4 — Verify, enforce coherence, report

Read the produced PNG and run the checklist in `references/verification.md`. The image
fails review if in-image text is not the verbatim English/numeric strings, if any
CJK/SQL/JOIN text appears, if it is not landscape, or if the palette breaks the
companion set's contract (two brand colors + exactly one reserved accent for the single
emphasized moment).

Then produce a consolidated report in the user's language using the template in
`references/verification.md`: a table with image, filename, and verdict, plus any
non-fatal warnings (e.g., auth-token refresh notices, deprecation notices) — read from the
extracted `agent_message` narrative (Step 3 jq line) AND from the Step 3 banner-warning
grep over the raw `$EVENTS_JSONL` (some warnings ride the non-JSON stderr lines, not the
narrative) — so the user sees the full picture without reading raw codex output.

## What stays fixed vs. what varies

**Fixed discipline** (carry into every call — details in `references/house-style.md`):
Codex CLI run in the background, output read on notification; in-image text
English/numeric only; landscape; no SQL/JOIN jargon; two brand colors + one reserved
accent; fixed model.

**Per-call data** (never bake into the skill): the artifact path and target passage, the
metaphor candidates, the loss-depth choice, the verbatim in-image strings, what the
accent emphasizes, and the output filename.

## Boundary

This skill forms and verifies; it delegates grounding to /forge and runs generation as a
background Codex CLI call. It does not open branches or PRs.
