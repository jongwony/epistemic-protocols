---
name: reflect
description: >-
  This skill should be used when the user asks to "reflect on session",
  "extract insights", "analyze this conversation", "run /reflect",
  or wants a shortcut to invoke the full reflexion workflow.
  Alias for the reflexion skill with complete phase execution.
---

# /reflect

Invoke the reflexion skill to analyze this session.

Call the reflexion skill which will:
1. Initialize TodoWrite to track all phases
2. Detect session context and memory mode
3. Extract session summary and insights (parallel subagents)
4. Guide you through insight selection (AskUserQuestion)
5. Integrate selected insights into User/Project memory
6. Verify completion and cleanup

If Prothesis is active, perspective selection occurs before extraction.
If Syneidesis is active, gap detection applies at each decision point.
