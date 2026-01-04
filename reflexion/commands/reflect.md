---
description: Analyze current session and extract insights into memory
---

# /reflect

Invoke the reflexion skill to analyze this session.

Call the reflexion skill which will:
1. Detect session context and memory mode
2. Extract session summary and insights (parallel subagents)
3. Guide you through insight selection (AskUserQuestion)
4. Integrate selected insights into User/Project memory
5. Verify completion

If Prothesis is active, perspective selection occurs before extraction.
If Syneidesis is active, gap detection applies at each decision point.
