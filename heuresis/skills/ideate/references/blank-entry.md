# Blank entry — frame-first gate before any concrete candidate

Read when `Entry = Blank` — before Phase 1 presents anything to the user. This is the
frame-first law: the presentation template, the frame map's answer, and the
requirement they jointly satisfy.

On a Blank entry, the frame map is presented via Cognitive Partnership Move (Constitution)
BEFORE any concrete candidate is generated — abstract frames only, so the user picks a
direction of divergence, not a specific idea, preserving ownership and mitigating
early-example fixation.

**Blank path — present the frame map before any concrete candidate:**

```
question: "Which angles do you want open first?"
selection: multiple
options:
  - label: "[Frame A]"
    description: "[one-line angle]"
  - label: "[Frame B]"
    description: "[one-line angle]"
  - label: "[Frame C]"
    description: "[one-line angle]"
Or:
- Stop — end here; nothing has been generated yet
```

Selecting ≥1 frame proceeds to Phase 2 with exactly those frames open. **Stop** here returns
`EarlyExit` with every derived frame declared as `frames_offered` — nothing was generated, and
that is stated plainly, not silently dropped.

The answer is Open or Stop. Open's selected frames are the frames the first pass opens;
an Open that selects none presents the map again rather than running an empty pass. Stop
returns EarlyExit before anything is generated — a genuine differential future, not a
meta-action, so it stays a peer answer rather than a free-response path.
