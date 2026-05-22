# House Style Discipline

These are the constraints that make a set of images read as one artifact's voice. Apply
them to every image; pass them into `/forge` as the `Constraints` / `Avoid` / `Color
palette` material.

## Why each rule exists

Understanding the reason lets you adapt the rule to a new artifact instead of copying it
blindly.

### In-image text: English / numeric only

gpt-image-2 renders CJK glyphs unreliably — Korean text in the image often comes out
garbled or invented. So keep every in-image string to short Latin/numeric tokens that
the model renders cleanly, and add the Korean slide copy later in the deck, outside the
image. List the exact strings as the `Text (verbatim)` field so forge constrains the
model to them and nothing else.

### No SQL / JOIN / internal jargon in the image

The images are usually for an all-hands or cross-functional audience. Words like
`JOIN`, `INNER`, `OUTER`, `SQL`, or internal API/emitter names defeat the "intuitive at a
glance" goal and read as engineer-only. Symbolize the *mechanism* with an everyday
metaphor instead. Put these words in the `Avoid` list explicitly — the model will
otherwise label diagram parts with them.

### Landscape aspect

These are slide assets. Landscape composition leaves room for slide copy above/below and
matches deck geometry.

### Two brand colors + exactly one reserved accent

A set reads as one set when its palette is disciplined: two brand/identity colors carry
the structure, and **one** warm accent (amber/orange) is reserved for the single
emphasized moment — the loss, the reveal, the punchline. Spending the accent on more than
one thing per image dilutes the emphasis and breaks set consistency.

The *specific* colors are per-artifact data, not part of the discipline. For the
ring_alarm series the contract was: Amplitude purple `#6838b0`, Snowplow blue `#0060c8`,
neutral grays on near-white, and amber reserved for the unsent/loss moment. A different
artifact will have different brand colors — read them off the existing companion images
and reuse them; only the "two + one-accent" *structure* is fixed.

### Fixed model (not a tunable)

The Codex image path substitutes its own internal `imagegen` skill, which targets
`gpt-image-2`. So the model choice is structural, not a quality knob you sweep. Settle it
once on the `codex exec -m gpt-5.5` call and keep it stable across the set — changing it
mid-series risks a visible style break, which is exactly what series coherence forbids.

## Series coherence is first-class

Before generating a new image, read the companion images already made for the same
artifact (same output directory, or earlier in this session). Their palette, accent
choice, icon style (flat line icons, no 3D/photorealism), and text conventions are the
contract the new image must satisfy. When you are making the *first* image, you are
setting that contract — state the choices explicitly so later calls in the session
inherit them through the carried context.
