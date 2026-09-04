---
name: route
description: "Route the accumulated session context to the loaded core protocol whose deficit it shows — /route. Invokes the one dominant match, nudges when several fit, stays silent when none."
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and invoke that protocol. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## What it does

1. **Take the candidates** from the harness's own loaded-skills listing: the loaded core protocol identifiers, and nothing else. Route carries no matching table of its own; a protocol not loaded is not a candidate.
2. **Resolve each candidate's deficit** from that protocol's own declared description — the text the protocol itself publishes, which names the interaction deficit it resolves. A listing that already carries those descriptions has resolved them and nothing further is read; a listing that carries identifiers alone leaves the deficits unresolved, and resolving them requires the capability to read a loaded skill's own declared description. A candidate whose description cannot be resolved drops out rather than being matched on a guess about what its identifier means.
3. **Match** the accumulated session context against each resolved deficit. The question per protocol is whether the context, as it stands now, is the situation that description names.
4. **Decide** by the option-set relay test:
   - one protocol is the analytically dominant match → **call the skill-invocation capability** with that protocol's skill identifier, passing a one-sentence deficit-framed statement of the current context as its argument. Issuing that call is what discharges this branch: naming the match belongs to the matching step, and the routing is the call. The invoked protocol's own opening detection and first gate hold the user's judgment.
   - several protocols fit, or the one match is weak → emit one line per fitting protocol, `↗ /command — reason`, and stop.
   - nothing fits, or no candidate's deficit resolved → say nothing.

```
── FLOW ──
Route(C) → Candidates(listing) → P → Resolve(P) → D → Match(C, D) → M →
  |M| = 1 ∧ dominant:  call(skill_invocation, id(protocol(M)), deficit_statement(C)) → stop
  |M| ≥ 2 ∨ weak:      emit(↗ /command — reason) → stop       -- one line per protocol that fits
  |M| = 0:             silence → stop                          -- reached by no match and by dom(D) = ∅ alike
-- exactly one branch fires, and its stop ends Route's turn; work on C itself is not a branch

── TYPES ──
C  = AccumulatedContext   -- the current session as it stands at this prompt
P  = Set(ProtocolId)      -- loaded core protocol identifiers, read off the harness listing; candidacy and nothing more
D  = Map(ProtocolId, Deficit)  -- each candidate's deficit, read off that protocol's own declared description
Resolve = P → D           -- identity where the listing already carries the descriptions; otherwise it requires the
                          -- capability to read a loaded skill's own declared description
                          -- p ∉ dom(D) exactly where that description could not be resolved, so p never reaches Match
M  = Set(Protocol)        -- candidates in dom(D) whose resolved deficit the context shows; M ⊆ dom(D) ⊆ P
deficit_statement(C) = one sentence naming the deficit the context shows, handed to the invoked protocol
ProtocolInvocation = Invoke(protocol, deficit_statement) | Nudge(List(protocol)) | Silence
deficit:  DeficitUnrouted   -- the context shows a deficit no protocol has yet been called for
preserves: C                -- context is read, never rewritten
invariant: Routing over Doing
```

## Rules

1. **Routing is the whole turn** — Route ends at exactly one of the three outcomes: the invocation call, the nudge lines, or silence. Taking the candidates and resolving their deficits is the matching step, not the deliverable. Where no protocol dominates, the nudge or silence branch is already the complete end. The object-level work the context was asking for belongs to the invoked protocol or to the turn after, never to Route's own; a turn that ends in that work has skipped the routing it was invoked to do.
2. **The loaded set bounds candidacy; each protocol's own description supplies its deficit** — the harness's loaded-skills listing is the sole source of *which* protocols are candidates, and each candidate's own declared description is the sole source of *what* deficit it resolves. Route reads no curated routing table, no other plugin's catalog file, and no session store. Resolving an identifier the listing carried without its description is not reading a table: it is reading the same text the listing would have carried, from where the protocol itself states it.
3. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question.
