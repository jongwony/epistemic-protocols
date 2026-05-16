# Periagoge Calibrative Induction Morphism

Periagoge keeps its endpoint fixed:

```
AbstractionInProcess -> CrystallizedAbstraction
```

The morphism change is not a new protocol type. It is a lower-load path to the
same endpoint: before asking the user to shape a candidate, the runtime should
show how the observed instances calibrate the user's in-process concept.

The current type frame is stable. `A` already carries an abstraction seed:
instances, essence intuition, and optional label. The missing runtime surface is
the calibration relation between the seed and the candidate:

```
A
  -> detect instances, essence, locator
  -> calibrate the in-process concept against the instance set
  -> propose candidate plus grounding plus calibration map
  -> triangulate with type-preserving user moves
  -> CrystallizedAbstraction
```

Calibration has four user-facing fields:

| Field | Function |
|---|---|
| Keeps | What the instance set repeatedly supports and should be preserved |
| Sharpens | What must become clearer for the concept to be usable |
| Prunes | What the instance set does not support or overextends |
| Open | What remains unresolved without blocking crystallization |

This keeps user correction substrate-mediated. AI does not override the user's
concept from above; the instance set pressures the candidate, and AI surfaces
that pressure in a compact map the user can recognize.

The Phase 2 options remain the existing `UserMove` coproduct. They may be
materialized into lower-load labels, but the answer type is unchanged:

| Lower-load label | UserMove constructor |
|---|---|
| Use this | Confirm |
| Broaden it | Widen |
| Tighten it | Narrow |
| Merge it with another concept | Fuse |
| Change the axis | Reorient |
| Drop this candidate | Dismiss |

The soundness constraint is therefore: add `CalibrationMap` as an intermediate
artifact, not as a new terminal resolution; keep `CrystallizedAbstraction` as the
only convergence object; keep user crystallization constitutive.
