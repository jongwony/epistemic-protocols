---
name: route
description: "Fires when the accumulated session context shows a deficit a loaded core protocol resolves: reads loaded descriptions, invokes the one dominant match, nudges when several fit, silent when none."
user_invocable: true
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke that protocol. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## What fires it

- **Hook directive** — the plugin's `UserPromptSubmit` hook places one short directive beside each prompt: if the accumulated context now shows an interaction deficit that one loaded epistemic protocol resolves, invoke `/route`; stay silent otherwise; skip while a protocol is active. The agent on the loop reads that directive and calls this skill.
- **Direct** — `/route` invoked by the user runs the same pass over the context as it stands.

The trigger is the deficit, not the topic: a turn fires this skill when what the session has accumulated is the situation one loaded protocol's description names.

## How it matches

1. **Read** the loaded epistemic protocol descriptions — the harness's own loaded-skills listing. Each names the interaction deficit that protocol resolves. Route carries no matching table of its own; a protocol not loaded is not a candidate.
2. **Match** the accumulated session context against each protocol's deficit. The question per protocol is whether the context, as it stands now, is the situation that description names.
3. **Decide** by the option-set relay test:
   - one protocol is the analytically dominant match → **invoke** it through the harness's skill invocation and stop. The invoked protocol's own opening detection and first gate hold the user's judgment.
   - several protocols fit, or the one match is weak → emit one line per fitting protocol, `↗ /command — reason`, and stop.
   - nothing fits → say nothing.

```
── FLOW ──
Route(C) → Read(loaded protocol descriptions) → Match(C, deficits) → M →
  |M| = 1 ∧ dominant:  invoke(protocol(M)) → stop            -- the protocol's own Phase 0 and first gate take over
  |M| ≥ 2 ∨ weak:      emit(↗ /command — reason) → stop       -- one line per protocol that fits
  |M| = 0:             silence → stop

── TYPES ──
C  = AccumulatedContext   -- the current session as it stands at this prompt
M  = Set(Protocol)        -- loaded core protocols whose deficit the context shows
ProtocolInvocation = Invoke(protocol) | Nudge(List(protocol)) | Silence
requires: ¬protocol_active(session)
deficit:  DeficitUnrouted   -- the context shows a deficit no protocol has yet been called for
preserves: C                -- context is read, never rewritten
```

## Rules

1. **Loaded descriptions only** — the harness's loaded-skills listing is the sole catalog. Route reads no routing table, no other plugin's file, and no session store.
2. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
3. **Skip inside an active protocol** — when an epistemic protocol is already running, Route does nothing.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question.
