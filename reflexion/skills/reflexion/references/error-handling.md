# Error Handling

Recovery procedures for common Reflexion workflow errors.

| Error | Recovery |
|-------|----------|
| Session file too large | Use offset/limit in Read tool |
| Subagent timeout | Retry once, then proceed without that output |
| User dismisses all insights | Skip to Phase 5 verification |
| Handoff file missing | Re-run relevant subagent |
