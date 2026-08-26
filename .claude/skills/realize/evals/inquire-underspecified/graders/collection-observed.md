---
type: tool_used
tool: Read
min: 1
target: trace
---
# Context collection must occur

Phase 1 reads the available substrate before the formal branch is selected. A run that surfaces
uncertainties without inspecting the directory has skipped that transition.

This predicate establishes occurrence only. One read satisfies it; it does not establish whether
the read preceded a user-facing inquiry or whether collection was thorough. `Grep` and `Glob` are
reads too and satisfy it equally — the schema names one tool per grader, so `Read` stands for the
act rather than for the tool.
