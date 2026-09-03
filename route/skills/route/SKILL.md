---
name: route
description: "Route the accumulated session context to the loaded core protocol whose deficit it shows — /route. Invokes the one dominant match, nudges when several fit, stays silent when none."
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke that protocol. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## What it does

1. **Read** the loaded core epistemic protocol descriptions — the harness's own loaded-skills listing. Each names the interaction deficit that protocol resolves. Route carries no matching table of its own; a protocol not loaded is not a candidate.
2. **Match** the accumulated session context against each protocol's deficit. The question per protocol is whether the context, as it stands now, is the situation that description names.
3. **Decide** by the option-set relay test:
   - one protocol is the analytically dominant match → **call the skill-invocation capability** with that protocol's skill identifier, passing a one-sentence deficit-framed statement of the current context as its argument. Issuing that call is what discharges this branch: naming the match belongs to the matching step, and the routing is the call. The invoked protocol's own opening detection and first gate hold the user's judgment.
   - several protocols fit, or the one match is weak → emit one line per fitting protocol, `↗ /command — reason`, and stop.
   - nothing fits → say nothing.

```
── FLOW ──
Route(C) → Read(loaded protocol descriptions) → Match(C, deficits) → M →
  |M| = 1 ∧ dominant:  call(skill_invocation, id(protocol(M)), deficit_statement(C)) → stop
  |M| ≥ 2 ∨ weak:      emit(↗ /command — reason) → stop       -- one line per protocol that fits
  |M| = 0:             silence → stop
-- exactly one branch fires, and its stop ends Route's turn; work on C itself is not a branch

── TYPES ──
C  = AccumulatedContext   -- the current session as it stands at this prompt
M  = Set(Protocol)        -- loaded core protocols whose deficit the context shows
deficit_statement(C) = one sentence naming the deficit the context shows, handed to the invoked protocol
ProtocolInvocation = Invoke(protocol, deficit_statement) | Nudge(List(protocol)) | Silence
deficit:  DeficitUnrouted   -- the context shows a deficit no protocol has yet been called for
preserves: C                -- context is read, never rewritten
invariant: Routing over Doing
```

## Rules

1. **Routing is the whole turn** — Route ends at exactly one of the three outcomes: the invocation call, the nudge lines, or silence. Reading the descriptions is the matching step, not the deliverable. Where no protocol dominates, the nudge or silence branch is already the complete end. The object-level work the context was asking for belongs to the invoked protocol or to the turn after, never to Route's own; a turn that ends in that work has skipped the routing it was invoked to do.
2. **Loaded descriptions only** — the harness's loaded-skills listing is the sole catalog. Route reads no routing table, no other plugin's file, and no session store.
3. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question.
