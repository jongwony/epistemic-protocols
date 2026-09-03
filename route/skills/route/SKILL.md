---
name: route
description: "Experimental. Read the loaded protocol descriptions, match the accumulated session context to the one deficit it shows, and invoke that protocol; nudge when several fit, stay silent when none."
user_invocable: true
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke that protocol. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

This skill is **experimental**. It is the candidate replacement for `/probe`: where `/probe` puts two or more deficit hypotheses to the user and lets recognition constitute the route, `/route` acts only when the context has already collapsed the choice to one protocol, and steps aside otherwise. Whether that collapse can be read reliably enough from context alone is the experiment; if it holds up in use, `/probe` is the skill it retires.

## Definition

**Route**: a relay act. The agent already holds every loaded epistemic protocol's description — each names the interaction deficit it resolves. Route reads those descriptions against what the session has accumulated, and when exactly one protocol's deficit is what the context shows, hands the turn to that protocol. The invoked protocol's own opening detection and first gate remain where the user's judgment lives; Route adds no gate of its own.

```
── FLOW ──
Route(C) → Read(loaded protocol descriptions) → Match(C, deficits) → M →
  |M| = 1 ∧ dominant:  invoke(protocol(M)) → stop            -- relay: the protocol's own Phase 0 and first gate take over
  |M| ≥ 2 ∨ weak:      emit(↗ /command — reason) → stop       -- one line per protocol that fits, no gate
  |M| = 0:             silence → stop

── MORPHISM ──
AccumulatedContext
  → read(descriptions)        -- the harness's loaded-skills listing; never a file of another plugin
  → match(deficits)           -- which loaded protocol's deficit the context now shows
  → decide(relay | nudge | silence)   -- option-set relay test: one dominant match relays; several keep the choice open
  → invoke(protocol) | nudge | silence
  → ProtocolInvocation
requires: ¬protocol_active(session)   -- Route never fires inside a running protocol
deficit:  DeficitUnrouted             -- the context shows a deficit no protocol has yet been called for
preserves: C                          -- context is read, never rewritten

── TYPES ──
C  = AccumulatedContext   -- the current session as it stands at this prompt
M  = Set(Protocol)        -- loaded core protocols whose deficit the context shows
ProtocolInvocation = Invoke(protocol) | Nudge(List(protocol)) | Silence
```

## Activation

Two entries, one behavior:

- **Hook directive** — the plugin's `UserPromptSubmit` hook places a short directive beside each prompt: invoke `/route` when the accumulated context shows a deficit a loaded protocol resolves; stay silent otherwise; skip while a protocol is active. The agent on the loop reads that directive and calls this skill.
- **Direct** — `/route` invoked by the user runs the same read → match → decide pass over the context as it stands.

## Protocol

1. **Read** the loaded epistemic protocol descriptions. Route carries no matching table of its own; the descriptions the harness loaded are the whole catalog, so a protocol not loaded is not a candidate.
2. **Match** the accumulated session context against each protocol's deficit. The question per protocol is whether the context, as it stands now, is the situation that protocol's description names.
3. **Decide** by the option-set relay test:
   - one protocol is the analytically dominant match → **invoke** it through the harness's skill invocation and stop. The invoked protocol's own detection and first gate hold the user's judgment; Route neither confirms nor summarizes ahead of it.
   - several protocols fit, or the one match is weak → emit one line per fitting protocol, `↗ /command — reason`, and stop. No gate; the user picks by invoking one or moving on.
   - nothing fits → say nothing.

## Distinction

| Surface | When it acts | What it does |
|---------|--------------|--------------|
| `/catalog` session-start routing map | Session start | Injects a static deficit → protocol directive once; the agent routes from it on its own |
| `/probe` | User invokes, or AI offers on deficit-ambiguity | Presents two or more deficit hypotheses; the user's recognition constitutes the route |
| `/route` | Every prompt via the hook directive, or on `/route` | Reads loaded descriptions against accumulated context; invokes the one dominant protocol, nudges when several fit, stays silent when none |

The three coexist during the experiment. `/route` is the only one that invokes rather than offers, and the only one triggered per prompt.

## Rules

1. **Loaded descriptions only** — the harness's loaded-skills listing is the sole catalog. Route reads no routing table, no other plugin's file, and no session store.
2. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
3. **Skip inside an active protocol** — when an epistemic protocol is already running, Route does nothing; the running protocol's own nudges cover other deficits.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question.
5. **Option-set relay test governs** — a single dominant match is a relay and is invoked; a set with more than one live member keeps the choice with the user, as a nudge. Route never scores or ranks protocols to force a single match.
6. **Silence is a valid outcome** — when no loaded protocol's deficit fits, Route emits nothing. A turn with no deficit is the common case.
7. **Experimental** — this skill's contract may change or be retired; it exists to test whether context alone can carry the route `/probe` currently asks the user to constitute.
