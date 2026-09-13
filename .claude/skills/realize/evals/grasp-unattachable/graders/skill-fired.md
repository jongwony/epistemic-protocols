---
type: llm
target: trace
focus: whether the katalepsis skill was invoked on arms that had it available
---
# The protocol must fire where it is available

Katalepsis is user-initiated only. The invocation line the harness injects on protocol arms
IS that invitation, so on those arms firing is the expected behaviour and not firing is the
finding. On arms without the plugin there is nothing to fire and this grader does not apply.

## Met

A `Skill` tool use names `grasp` on an arm whose treatment includes the plugin.

## Not met

No such invocation on an arm that had the plugin available.

## Not applicable

Arms without the plugin. Absence there is the treatment, not a result.
