---
type: tool_used
tool: Read
min: 1
target: trace
---
# Context collection must occur

Invoking `/inquire` starts collection even when the prompt looks complete: `start` collects
before `afterCollection` can complete the run by evidence. A run that declares the context
sufficient without inspecting the directory has skipped that transition.

This predicate establishes occurrence only. One read satisfies it; it does not establish whether
the read preceded the sufficiency statement — that ordering is `phase0-relay`'s — or whether
collection was thorough. `Grep` and `Glob` are reads too and satisfy it equally — the schema
names one tool per grader, so `Read` stands for the act rather than for the tool.
