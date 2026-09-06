---
name: route
description: "Route the accumulated session context to the loaded core protocol whose deficit it shows — /route. Invokes the dominant match, nudges when several fit, silent when none, monitors while a gate holds."
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
   - **a gate holds the user's judgment** — a protocol presented a checkpoint this session, and its own contract has not yet taken an answer at it, closed it, or entrusted the prompt to the session — → that protocol reads the prompt first, the way its contract reads any free response at that stop: an answer, a decline, a withdrawal, a dismissal, or a handoff to the session under a continuation it holds. Route reads the context that reading leaves, and reads off it which gates still hold: a checkpoint the reading closed, or whose contract entrusted the prompt to the session, holds no longer, so where none holds Route is in the ordinary branches above and what the protocol recorded is residual, read at the next prompt (Rule #5). One gate still holding, with a different protocol the dominant match → **monitor mode**: emit one `↗ /command — reason` line as a finding, invoke nothing, and let the turn go back to that gate. Detecting a deficit and switching to it are separate flows: the finding is a line in the transcript, which the user reads where that gate next stops for them, and whether to switch is theirs to answer there — as a free response, which the protocol handles the way its contract handles any free response at that stop. That protocol's contract ends at its own boundary; the finding lives in the transcript, outside it, and adds no path to the contract. More than one gate holding — reachable only through the user's own invocation, since Route invokes nothing while one holds → silence: each protocol's own gate governs, and Route arbitrates nothing between them. Whether a gate holds is read from what its contract says of the checkpoint it presented, never from a session store; a protocol's prose in context holds nothing, and neither does an invocation whose checkpoint the contract has since closed.

```
── FLOW ──
Route(C) → Candidates(listing) → P → Resolve(P) → D → Match(C, D) → M →
  holding(C) = ∅ ∧ single(M):                       call(skill_invocation, id(protocol(M)), deficit_statement(C)) → stop
  holding(C) = ∅ ∧ |M| ≥ 1 ∧ ¬single(M):            emit(↗ /command — reason) → stop       -- one line per protocol that fits
  holding(C) = ∅ ∧ |M| = 0:                         silence → stop                          -- reached by no match and by dom(D) = ∅ alike
  holding(C) = {A} ∧ single(M) ∧ protocol(M) ≠ A:   finding(↗ /command — reason) → continue   -- monitor mode: a line in the transcript; no invoke, no stop
  holding(C) = {A} ∧ single(M) ∧ protocol(M) = A:   silence → continue                        -- monitor mode: A is already the match
  holding(C) = {A} ∧ ¬single(M):                    silence → continue                        -- monitor mode: nothing dominates
  |holding(C)| ≥ 2:                                 silence → continue                        -- each gate governs; Route arbitrates nothing between them
-- holding(C) is read after each protocol whose checkpoint stood at the prompt has read the prompt by its own contract; C is the context that reading leaves
-- exactly one branch fires; a stop ends Route's turn, a continue hands the turn back to the gate that holds it
-- work on C itself is never a branch

── TYPES ──
C  = AccumulatedContext   -- the session as it stands when Route reads it: after any protocol whose checkpoint stood at the prompt has read the prompt by its own contract
P  = Set(ProtocolId)      -- loaded core protocol identifiers, read off the harness listing; candidacy and nothing more
D  = Map(ProtocolId, Deficit)  -- each candidate's deficit, read off that protocol's own declared description
Resolve = P → D           -- identity where the listing already carries the descriptions; otherwise it requires the
                          -- capability to read a loaded skill's own declared description
                          -- p ∉ dom(D) exactly where that description could not be resolved, so p never reaches Match
M  = Set(Protocol)        -- candidates in dom(D) whose resolved deficit the context shows; M ⊆ dom(D) ⊆ P
deficit_statement(C) = one sentence naming the deficit the context shows, handed to the invoked protocol
holding(C) = Set(Protocol)     -- the protocols whose presented checkpoint still holds the user's judgment, each by its own contract's reading of the prompt: a checkpoint the contract has taken an answer at, closed, or entrusted to the session under a continuation it holds is not in the set; read off C, never off a session store; a protocol's prose in context puts nothing in it
single(M) ≡ |M| = 1 ∧ dominant   -- protocol(M) names the one member, and is projected only under single(M)
Finding   = ↗ /command — reason  -- one line in the transcript while one gate holds; the user reads it where that gate next stops for them and answers it, if at all, to that protocol
residual(A) ⊆ C                -- what a protocol recorded as unresolved, in its own terms, when it converged or deactivated; accumulated context like any other, so Match reads it at the next prompt
ProtocolInvocation = Invoke(protocol, deficit_statement) | Nudge(List(protocol)) | Silence | Finding
deficit:  DeficitUnrouted   -- the context shows a deficit no protocol has yet been called for
preserves: C                -- context is read, never rewritten
invariant: Routing over Doing; composition is Route's — each protocol ends at its own boundary
```

## Rules

1. **Routing is the whole turn, except in monitor mode** — Route ends at exactly one of the three outcomes: the invocation call, the nudge lines, or silence. In monitor mode (a gate holds the user's judgment) the deliverable is a finding line and Route ends nothing: the turn goes back to the gate that holds it, and the finding sits in the transcript where the user next reads it. A finding is Extension — it relays a match and exercises no authority — so it may not stop the loop, and it invokes nothing. The finding is Route's output, produced by invoking Route; a line written in its place without the invocation is not one. A prompt that arrives while a gate holds is that protocol's to read first, as its contract reads any free response at that stop; Route reads the context that reading leaves, and a checkpoint the reading closed or entrusted to the session holds no longer. Taking the candidates and resolving their deficits is the matching step, not the deliverable. Where no protocol dominates, the nudge or silence branch is already the complete end. The object-level work the context was asking for belongs to the invoked protocol or to the turn after, never to Route's own; a turn that ends in that work has skipped the routing it was invoked to do.
2. **The loaded set bounds candidacy; each protocol's own description supplies its deficit** — the harness's loaded-skills listing is the sole source of *which* protocols are candidates, and each candidate's own declared description is the sole source of *what* deficit it resolves. Route reads no curated routing table, no other plugin's catalog file, and no session store. A holding gate is not session state in that sense: the checkpoint a protocol presented, and whatever its contract has since done with it, are text in the accumulated context Route already reads. Resolving an identifier the listing carried without its description is not reading a table: it is reading the same text the listing would have carried, from where the protocol itself states it.
3. **Core protocols only** — Route invokes epistemic protocols that resolve a named interaction deficit. It never routes to itself or to another utility skill.
4. **No gate of its own** — Route presents no options. The invoked protocol's first gate is where the user judges; a nudge line is a pointer, not a question, and a finding is a pointer left in the transcript. Route never terminates a protocol and never folds its state: what becomes of the holding gate when the user takes a finding is whatever that protocol's own contract provides for that response, with any residual recorded there.
5. **Route composes from residual** — a core protocol resolves the one deficit it names and stops where that deficit ends — at convergence, or at a deactivation its own contract provides — recording what it could not resolve as residual in its own terms. That residual is accumulated context like any other: at the next prompt Route reads it for the deficit it now shows and routes there, with no pointer from the protocol that left it. Where a protocol's own contract already states a route onward, that route is the protocol's and Route reads it as context like the rest; the composition Route performs is the one that needs no such statement — a protocol detects its own boundary, Route detects the next deficit, and the two detections meet in the transcript. Route places nothing inside a protocol.
6. **Route keeps no state** — everything Route does is done by reading the accumulated context at one prompt: it holds no stack of parked protocols and records no resumption point outside the transcript. What a protocol leaves when the user turns away from it — a residual folded at a dismissal or a withdrawal, or a checkpoint its own contract holds across a continuation — is that protocol's record, in its own terms, and Rule #5 is how Route comes back to it: read at the next prompt as the deficit it then shows.
