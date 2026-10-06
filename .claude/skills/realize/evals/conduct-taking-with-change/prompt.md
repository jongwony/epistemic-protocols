---
name: conduct-taking-with-change
tags: [hyphegesis, trigger-positive, type-realization, multi-turn]
plugins: ["hyphegesis"]
runs: 3
max_turns: 24
timeout_seconds: 420
allowed_tools: [Read, Grep, Glob, Bash, Write, Edit]
---
The three exporters in `exporters/` (CSV, JSON and XML) are the last code still calling
`report.legacy`. I want all three moved onto `report.api`; `MIGRATION.md` describes it.

I have not worked out how to go about it: whether to do them side by side or one at a time, and in
what order; what counts as done for each one; what happens if one of them stops matching its
golden file; how we will know each still writes what it wrote before; and where the result should
end up.

The code is in this directory.
