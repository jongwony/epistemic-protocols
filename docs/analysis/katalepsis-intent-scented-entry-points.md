# Katalepsis Intent-Scented Entry Points

Katalepsis keeps its endpoint fixed:

```
ResultUngrasped -> VerifiedUnderstanding
```

The v2 change is not a wider learning endpoint. It is a front-door change in
the morphism. The old runtime asked users to choose artifact categories before
they had enough grip to know which category matched their concern. That raised
cognitive load at the moment when the protocol should lower it.

The grounded UX principle is information scent: the first options should tell
the user what a path will make clear. Progressive disclosure follows from the
same principle. Artifact categories are still useful, but only after the user
has recognized an intent path such as approval, rationale, impact, orientation,
or transfer.

This yields the new shape:

```
Result + user signal
  -> orient likely comprehension intents
  -> present intent-scented entry points
  -> materialize artifact basis
  -> verify comprehension
  -> VerifiedUnderstanding
```

The distinction matters for Plugin Encapsulation. `Skill.md` must carry the
runtime behavior itself: first user-facing options name the user's likely
comprehension intent; artifact categories become grounding material for probes.
Contributor docs may explain the research rationale, but packaged users should
not need to read those docs to receive the lower-load interaction.

Boundary: Katalepsis still verifies grasp of the present result. It does not
become a general learning-transfer protocol, a planning protocol, or a decision
gap scan. If the selected entry point reveals decision alternatives, the user
can route to `/gap`; Katalepsis only verifies the user's understanding of the
result and the implications already present in it.
