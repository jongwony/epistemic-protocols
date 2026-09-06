---
name: route
description: "Route the accumulated session context to the loaded core protocol whose deficit it shows — /route. Invokes the dominant match, nudges when several fit, silent when none, monitors while one is active."
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
   - **a protocol is active** and the dominant match is a different protocol → by where the deficit sits. Shown by the **accumulated context** → **monitor mode**: emit one `↗ /command — reason` line as a finding, invoke nothing, and let the turn continue. Detecting a deficit and switching to it are separate flows: the finding is a line in the transcript, which the user reads where the active protocol next stops for them, and whether to switch is theirs to answer there — as a free response, which the active protocol handles the way its contract handles any free response at that stop. Carried by the **prompt itself** → the user has turned away, and that is the switch: **invoke** as in the ordinary branch, relaying in one line what is left open (the active protocol and the checkpoint it stopped at) and that Route returns there by reading the transcript once the new protocol converges. Either way the active protocol's contract ends at its own boundary; the finding and the relay line live in the transcript, outside it, and add no path to the contract. A protocol is active when its invocation is in the accumulated context and no converge or deactivate it emitted has followed; its prose alone does not make it active.

```
── FLOW ──
Route(C) → Candidates(listing) → P → Resolve(P) → D → Match(C, D) → M →
  |M| = 1 ∧ dominant:  call(skill_invocation, id(protocol(M)), deficit_statement(C)) → stop
  |M| ≥ 2 ∨ weak:      emit(↗ /command — reason) → stop       -- one line per protocol that fits
  |M| = 0:             silence → stop                          -- reached by no match and by dom(D) = ∅ alike
  active(C) = Some(A) ∧ |M| = 1 ∧ dominant ∧ protocol(M) ≠ A ∧ source(M) = context:  finding(↗ /command — reason) → continue   -- monitor mode: a line in the transcript; no invoke, no stop
  active(C) = Some(A) ∧ |M| = 1 ∧ dominant ∧ protocol(M) ≠ A ∧ source(M) = prompt:   relay(open(A)) ; call(skill_invocation, id(protocol(M)), deficit_statement(C)) → stop   -- the user turned away: invoke, saying what is left open
  active(C) = Some(A) ∧ (protocol(M) = A ∨ |M| ≠ 1 ∨ weak):      silence → continue                        -- monitor mode: A is already the match, or nothing dominates
  open(P) ∈ C ∧ protocol(M) = P:                                 relay(open(P)) → stop                     -- already open in the transcript: never invoked anew; the relay points back to its checkpoint
-- outside monitor mode exactly one branch fires and its stop ends Route's turn; in monitor mode nothing stops — the turn goes on with A
-- work on C itself is never a branch

── TYPES ──
C  = AccumulatedContext   -- the current session as it stands at this prompt
P  = Set(ProtocolId)      -- loaded core protocol identifiers, read off the harness listing; candidacy and nothing more
D  = Map(ProtocolId, Deficit)  -- each candidate's deficit, read off that protocol's own declared description
Resolve = P → D           -- identity where the listing already carries the descriptions; otherwise it requires the
                          -- capability to read a loaded skill's own declared description
                          -- p ∉ dom(D) exactly where that description could not be resolved, so p never reaches Match
M  = Set(Protocol)        -- candidates in dom(D) whose resolved deficit the context shows; M ⊆ dom(D) ⊆ P
deficit_statement(C) = one sentence naming the deficit the context shows, handed to the invoked protocol
active(C) = Option(Protocol)   -- the protocol whose invocation is in C with no converge or deactivate it emitted after it; read off C, never off a session store
Finding   = ↗ /command — reason  -- one line in the transcript while active(C) holds; the user reads it where A next stops for them and answers it, if at all, to A
residual(A) ⊆ C                -- what a converged protocol recorded as unresolved, in its own terms; accumulated context like any other, so Match reads it at the next prompt
source(M) ∈ {prompt, context}  -- whether the prompt itself carries the matched deficit (the user turned away) or the accumulated context shows it (Route detected it)
open(A)   = one relay line     -- "leaves open: A at <checkpoint>; returns there by reading once <protocol(M)> converges" — text in the transcript, never stored state; Route reads it back like any residual
ProtocolInvocation = Invoke(protocol, deficit_statement) | Nudge(List(protocol)) | Silence | Finding
deficit:  DeficitUnrouted   -- the context shows a deficit no protocol has yet been called for
preserves: C                -- context is read, never rewritten
invariant: Routing over Doing; composition is Route's — each protocol ends at its own boundary
```

## Rules

1. **Routing is the whole turn, except in monitor mode** — Route ends at exactly one of the three outcomes: the invocation call, the nudge lines, or silence. In monitor mode (a protocol is active) the deliverable is a finding line and Route ends nothing: the turn continues with the active protocol, and the finding sits in the transcript where the user next reads it. A finding is Extension — it relays a match and exercises no authority — so it may not stop the loop, and it invokes nothing: it is for a deficit Route itself detected in the accumulated context. A prompt that carries a new deficit while a protocol is active is different in kind — the user has turned away, and the turn is the switch — so Route invokes as in the ordinary branch and relays what it leaves open; what becomes of the active protocol is still its own contract's (a free response, a decline, a dismissal, or a checkpoint left standing for Route to read back). The finding and the relay line are Route's output, produced by invoking Route; a line written in either's place without the invocation is neither. Taking the candidates and resolving their deficits is the matching step, not the deliverable. Where no protocol dominates, the nudge or silence branch is already the complete end. The object-level work the context was asking for belongs to the invoked protocol or to the turn after, never to Route's own; a turn that ends in that work has skipped the routing it was invoked to do.
2. **The loaded set bounds candidacy; each protocol's own description supplies its deficit** — the harness's loaded-skills listing is the sole source of *which* protocols are candidates, and each candidate's own declared description is the sole source of *what* deficit it resolves. Route reads no curated routing table, no other plugin's catalog file, and no session store. The active protocol is not session state in that sense: its invocation, and any converge or deactivate it emitted, are text in the accumulated context Route already reads. Resolving an identifier the listing carried without its description is not reading a table: it is reading the same text the listing would have carried, from where the protocol itself states it.
3. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question, and a finding is a pointer left in the transcript. Route never terminates a protocol and never folds its state: what becomes of the active protocol when the user takes a finding is whatever its own contract provides for that response, with any residual recorded there.
5. **Route composes from residual** — a core protocol resolves the one deficit it names and stops where that deficit ends, recording what it could not resolve as residual in its own terms. That residual is accumulated context like any other: at the next prompt Route reads it for the deficit it now shows and routes there, with no pointer from the protocol that left it. Where a protocol's own contract already states a route onward, that route is the protocol's and Route reads it as context like the rest; the composition Route performs is the one that needs no such statement — a protocol detects its own boundary, Route detects the next deficit, and the two detections meet in the transcript. Route places nothing inside a protocol.
6. **Route keeps no state; a turn away is relay** — everything Route does is done by reading the accumulated context at one prompt and relaying: it holds no stack of parked protocols and records no resumption point outside the transcript. When the user turns away from an active protocol, Route says in one line what it leaves open — the protocol and the checkpoint it stopped at — and when the newer protocol converges, that line is residual like any other (Rule #5): Route reads it and relays the way back to the open checkpoint, and the open protocol takes the answer as its contract already says. The reading is also the recursion guard: a protocol already open in the transcript is never invoked anew — Route relays that it is open and points at its checkpoint. What this leaves to use rather than to rule: an open checkpoint ages while the newer protocol runs, the same protocol can be matched from two directions, and depth is bounded by nothing but the reader; each is a known risk carried as relay until it is seen to bite, and a router that settles them with state across prompts belongs to a separate plugin on a hook layer that carries state, never to this skill.
