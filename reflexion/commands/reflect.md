---
description: Analyze current session and extract insights into memory
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
