---
name: inquire-underspecified
tags: [aitesis, trigger-positive, type-realization]
plugins: ["aitesis"]
runs: 3
max_turns: 12
timeout_seconds: 420
allowed_tools: [Read, Grep, Glob, Bash, Write, Edit]
---
I need you to add rate limiting to this service before we ship it on Friday.

Use `/inquire` first — I want the context checked before any code gets written.

The service is in this directory. Add the limiter and wire it into the request path.
