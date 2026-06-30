---
name: redact
description: "Redact secret-shaped values from a working context before it is emitted or handed downstream, so the value never reaches a portable artifact or a fresh recipient. Intercepts each secret per (item, location) to a placeholder, scrubs every copy of a detected value, preserves a command-substitution retrieval command as a grounded pointer, and routes a load-bearing secret out-of-band rather than dropping it. Type: (SecretExposed, AI, REDACT, WorkingContext) → RedactedContext. Alias: Apokrypsis(ἀπόκρυψις)."
---

# Apokrypsis Protocol

Redact the secret-shaped values out of a working context — conceal each secret's value while preserving the retrieval pointer that re-obtains it — before that context is emitted, handed to a fresh session, or passed to a downstream protocol such as `/distill`. The morphism is **conceal the value, keep the locus**: Apokrypsis intercepts each secret at its `(item, location)`, scrubs every copy of that value to a placeholder, preserves a command-substitution retrieval command as a grounded pointer, and surfaces a load-bearing secret for the user to route out-of-band — the value is never emitted. Type: `(SecretExposed, AI, REDACT, WorkingContext) → RedactedContext`.

## Definition

**Apokrypsis** (ἀπόκρυψις: a hiding-away, a concealment): A pass that intercepts secret-shaped content in a working context and replaces each secret **value** with a placeholder, so the value cannot propagate into any emitted or portable artifact, while the **retrieval locus** (a vault-read command, a secret-store key, a pointer the recipient can resolve out-of-band) is preserved. The protocol's lexical verb is `/redact`. It scans the working context per `(item, location)` — one context item may carry more than one secret, each keyed and intercepted separately — classifies each by kind, and **scrubs** every occurrence of each detected value (a value copied to a second location is caught by the same scrub), then surfaces any **load-bearing** secret (one the declared next task genuinely needs) for the user to settle out-of-band: route by a stable retrieval pointer, supply at use time, or drop. A front-door redaction pass is the real protection; an emit-scan backstop re-verifies the actual output and deterministically scrubs any straggling copy of a detected value before convergence.

**Boundary note (composition with `/distill`)**: `/distill` (Diylisis) assumes a **secret-free working context** — secret redaction is not part of the distill morphism. Apokrypsis is the upstream pass that earns that assumption: its `RedactedContext` **is** the secret-free context `/distill` consumes. Run `/redact`, then `/distill` (or `/attend`, or any portable-emit step) on the result.

**Substrate boundary**: Secret/credential policy is substrate-adjacent. Apokrypsis surfaces, classifies, and records the disposition of each secret — the epistemic work — but it does **not** itself enforce external substrate semantics: it never writes a value to a vault, mutates a secret store, or transmits a credential. Enforcement of out-of-band routing or secret-store storage is delegated by handoff at the gate to the harness or specialized credential tooling. Apokrypsis records what must happen and stops; the value is never emitted in the meantime.

```
── FLOW ──
Apokrypsis(W, next_task?) → Detect(W) → secret_present(W)? →
  none(W):     → relay(already secret-free; nothing to redact) (extension) → deactivate
  present:     init_loop_state: pass_n=1, sites=∅, redactions=∅, residual=∅, candidate=overlay(W), history=∅, loop:
    Phase 1 Scan(W) → sites = ⋃_item secret_locations(item) → classify(sites) → SecretKinds          -- per (item, location) detection + kind assignment
    Phase 2 Redact(sites) → ∀ s ∈ sites, value_site(s), longest value first : scrub(candidate, s) → (redactions, candidate') (transform) →   -- each value site → placeholder at EVERY occurrence (a copy at an unkeyed location is scrubbed by the same find-replace of the known value); a command-substitution locus is preserved (retrieval command kept, not scrubbed), only a separately-inlined resolved value (a distinct value site) is scrubbed; partition load_bearing → residual (surfaced = false)
    Phase 3 Gate(unsurfaced residual) →
      residual = ∅:           → (no load-bearing secret) skip gate (relay) → Phase 4
      residual ≠ ∅:           → Qc(per load-bearing secret) → Stop → A → integrate(A) → residual'     -- Constitution: Route / Supply / Drop out-of-band routing; VALUE never shown — surfaced by kind + location + placeholder
    Phase 4 Settle: emit_scan(candidate) →                                                            -- backstop: re-verify the ACTUAL candidate; deterministically scrub any straggling copy of a DETECTED value
      ∀ s ∈ sites : value_site(s) ∧ occurs(value(s), candidate): → scrub(candidate, s) → re-verify   -- a re-materialized / incompletely-scrubbed copy of a known VALUE (value site only): positive find-replace (terminating), append Redaction for the location; never a classifier re-run
      redaction_complete ∧ emit_clean ∧ residuals_surfaced: → emit RedactedContext → converge
      else:                   → loop (pass_n += 1)
```

```
── MORPHISM ──
WorkingContext
  → scan(secret_shaped) → SecretSites                  -- per (item, location) detection: a multi-secret item yields multiple sites, each keyed separately
  → classify(SecretSites) → SecretKinds                -- Credential | Token | ApiKey | PrivateKey | Password | CommandSubstitutionRef ∪ Emergent(Secret)
  → redact(SecretSites) → RedactionLedger              -- THE FRONT DOOR: scrub each detected value to a placeholder at EVERY occurrence (the value is never stored in the ledger nor reproduced); a command-substitution form keeps its retrieval command as a grounded pointer — only a separately-inlined resolved value is scrubbed, distinguishing the secret value from the retrieval locus
  → route(load_bearing) → dispositions: Set(Residual)  -- a needed secret is surfaced and routed out-of-band (vault pointer / out-of-band supply), never silently dropped; the VALUE is never emitted
  → settle(emit_scan) → fixed_point                    -- THE BACKSTOP: re-verify the actual candidate and deterministically scrub any straggling copy of a DETECTED value (positive find-replace of a known value — terminating). A value never classified as a secret is out of reach of both layers (Known Limitation), not silently claimed-handled
  → RedactedContext
requires: secret_present(W)                             -- runtime checkpoint (Phase 0); sole activation precondition
deficit: SecretExposed                                  -- activation precondition (Layer 1/2)
preserves: retrieval_locus(W)                           -- a command-substitution retrieval command survives as a grounded pointer; only the resolved value is removed (the secret value is distinguished from the retrieval locus)
invariant: Value Never Emitted                          -- no detected secret VALUE reaches any emit channel; a secret is surfaced only by kind + location + placeholder, never by value
invariant: Conceal over Erase                           -- the value is concealed, not the locus erased: a load-bearing secret is routed out-of-band, not lost, so the recipient can re-obtain it
```

```
── TYPES ──
W              = WorkingContext { items: List(ContextItem), next_task: Option(Task) }  -- the context to redact; next_task (when declared) is what makes a secret load-bearing
Secret         ∈ {Credential, Token, ApiKey, PrivateKey, Password, CommandSubstitutionRef} ∪ Emergent(Secret)  -- secret-shaped content classes the scan intercepts; the named set is a working hypothesis, not a closed taxonomy
secret_shaped(x) ≡ x matches a secret pattern — a credential / token / api-key / private-key / password literal or assignment, or a command-substitution secret reference (a $(...) form, a backtick substitution, or a shell variable expansion that resolves to a secret) — content whose VALUE must never reach an emit channel or a downstream recipient
secret_locations(item) = { loc : the content of item at loc is secret_shaped }  -- the sub-item locations within one item that carry a secret VALUE; a multi-secret item has |secret_locations| > 1, each keyed separately by location
SecretSite     = (item: ContextItem, location: String, kind: Secret)  -- one detected secret locus; sites = ⋃_item { (item, loc, kind) : loc ∈ secret_locations(item) }
value_site(s)  ≡ s.kind ≠ CommandSubstitutionRef  -- a site carrying an in-context secret VALUE (scrubbed at the front door). A CommandSubstitutionRef site is a retrieval LOCUS, not a value: it is preserved as a grounded pointer, never scrubbed; any separately-inlined resolved value is itself a distinct value site detected at its own location
value(s)       = the secret VALUE at a VALUE site s — the contiguous secret literal — read read-only from the session-side source W  -- NEVER stored in Λ nor emitted; computed transiently to (a) drive scrub and (b) drive the emit-scan occurrence test. A value site has a non-empty value by construction (no vacuous match, so no liveness trap); a CommandSubstitutionRef locus is NOT a value site — its secret is out-of-band behind the retrieval command, so it carries no in-context value to scrub or scan
occurs(v, c)   ≡ v appears as a contiguous occurrence (substring) in c  -- the SAME occurrence predicate scrub removes (find-replace of v); a scattered-token coincidence is NOT an occurrence. The emit-scan resident-value test uses occurs, so scan and scrub agree: every hit scrub can clear, so emit_clean is reachable (no token-subset false positive that scrub cannot resolve)
placeholder(s) = "[REDACTED:" ++ kind(s) ++ "@" ++ location(s) ++ "]"  -- the literal replacing a secret value: encodes kind + location for recipient recognition, never the value (an output-format token, pinned for recognizability)
scrub(candidate, s) = replace value(s) AT s.location, and every occurrence at an UNKEYED location (one not owned by another detected site), with placeholder(s) ∧ append a Redaction{s.item, kind(s), placeholder(s), s.location}  -- a deterministic find-replace of the positively-known value(s); s supplies item + kind + location to build placeholder(s) and the ledger row. An identical value at another DETECTED location is owned by that site's own scrub, so duplicate values keep distinct per-(item, location) placeholders and ledger rows; an unkeyed copy is attributed to the scrubbing site. It cannot re-miss (not a re-run of the secret_shaped classifier), so it terminates
Redaction      = { item: ContextItem, secret_kind: Secret, placeholder: String, location: String }  -- one interception, keyed by (item, location) so multiple secrets in one item are each recorded; the secret VALUE replaced by placeholder, recorded by kind + location ONLY (NO value field — the value is never reproduced)
RedactionLedger = List(Redaction)  -- the interception record for this invocation (Λ.redactions); surfaced in the convergence trace by kind + location, never by value
redact(sites)  = ∀ s ∈ sites, value_site(s), by descending value(s) length (LONGEST first) : scrub(candidate, s) — so a value containing another as a substring is replaced whole before its substring (no fragment of a longer secret survives, and emit_clean cannot pass on a partially-corrupted longer value); a CommandSubstitutionRef site is preserved, not scrubbed. For a command-substitution form ($(vault read …), a backtick substitution, a secret-resolving variable expansion), the form IS the retrieval locus: preserve it as a grounded pointer and scrub only a separately-inlined resolved value (itself a distinct value site). A load-bearing site ALSO appends a residual (surfaced = false) carrying its (item, loc) + placeholder — or, for a preserved command-substitution locus, its retrieval command — so it surfaces at the gate for routing
load_bearing(s) ≡ the AI's hypothesis that the declared next_task genuinely needs s's secret to run  -- a revisable proposal surfaced at the gate, not a settled fact: the user confirms it (Route / Supply) or revises it (Drop). Absent a declared next_task, a secret is treated as load-bearing iff the user marks it so
Disposition    ∈ {Route, Supply, Drop}  -- the per-secret gate answer for a load-bearing secret; presented intact per gate integrity
                 -- Route(locus): carry the secret by a stable retrieval pointer the recipient resolves out-of-band (a vault path, a secret-store key, the preserved command-substitution form)
                 -- Supply: no stable locus — the recipient supplies the value out-of-band at use time (env injection, prompt-time secret); the handoff names what is needed, never the value
                 -- Drop: the next task does not actually need this secret (the hypothesis revised); release it (the placeholder remains as a marker, the value is already scrubbed)
Residual       = { site: SecretSite, disposition: Option(Disposition), locus: Option(String), surfaced: Bool }  -- the load-bearing routing queue; silent residual forbidden: every entry must reach surfaced = true with a disposition before convergence; keyed per (item, loc) via site so a multi-secret item's load-bearing secrets stay DISTINCT entries
redacted(Λ, item, loc) ≡ ∃ r ∈ Λ.redactions : r.item = item ∧ r.location = loc  -- the secret VALUE at (item, loc) was scrubbed to a placeholder; per (item, location), so a 2nd secret in the same item is keyed separately
settled(Λ, s)  ≡ ¬value_site(s) ∨ redacted(Λ, s.item, s.location)  -- a site is handled per its kind: a VALUE site by scrubbing its value (redacted); a CommandSubstitutionRef LOCUS by preservation (Phase 2 keeps the retrieval command — no value scrub is forced at the locus). A bare $(vault read …) with no inlined value is settled by preservation, so convergence is reachable
unredacted_sites(Λ) = { s ∈ Λ.sites : ¬settled(Λ, s) }  -- detected sites not yet handled (a preserved command-substitution locus is already settled, never counted unredacted)
unsurfaced_residual(Λ) = { r ∈ Λ.residual : ¬r.surfaced }  -- load-bearing secrets not yet routed at the gate
fixed_point(Λ) ≡ redaction_complete(Λ) ∧ emit_clean(Λ) ∧ residuals_surfaced(Λ)  -- the convergence conjunction; settle's target
RedactedContext = { candidate: Overlay(W), redactions: RedactionLedger, dispositions: Set(Residual) }  -- the result: the context rendered through the redaction overlay (every detected value replaced by a placeholder), the interception record (by kind + location), and each load-bearing secret's settled out-of-band disposition. The secret-free context /distill consumes
Overlay(W)     = a redaction overlay over the read-only source W — the set of (location → placeholder) substitutions applied so far, NOT a materialized copy of W's content; the candidate renders W through the overlay, so Λ holds placeholders and structure, never a raw value
pass_n         = Nat  -- current settle-pass counter (visible at the gate)
```

```
── PHASE TRANSITIONS ──
Phase 0: W → Detect(W) → secret_present(W)?                                                          -- secret-presence checkpoint (silent); bind next_task read-only if declared
Phase 0 → deactivate (relay): ¬secret_present(W) → present "already secret-free; nothing to redact" as relay, deactivate (extension)
Phase 0 → Phase 1: secret_present(W) = true → init loop state (pass_n = 1, sites = ∅, redactions = ∅, residual = ∅, candidate = overlay(W), history = ∅)
Phase 1: W → Scan(W) → sites = ⋃_item secret_locations(item) → classify(sites) → SecretKinds        -- per (item, location) detection + kind assignment [Tool: Read, Grep, Glob]
Phase 2: sites → ∀ s ∈ sites, value_site(s), longest value first : scrub(candidate, s) → (redactions, candidate') ∧ preserve command-substitution loci ∧ partition load_bearing → residual  -- value sites scrubbed at every occurrence; command-substitution loci preserved (retrieval command kept); a load-bearing site appends a residual (surfaced = false)
Phase 3: unsurfaced residual → Qc(per load-bearing secret over Disposition) → Stop → A               -- per-secret out-of-band routing gate [Tool: Constitution interaction]
Phase 3 → Phase 4 (relay): residual = ∅ → no load-bearing secret to surface → skip the gate (extension)
Phase 3 → Phase 4: integrate(A) → residual' (surfaced = true, disposition bound)                     -- the value never shown; surfaced by kind + location + placeholder; append (site, kind, A) to history
Phase 4: candidate → Settle: emit_scan(candidate) → measure progress → fixed_point?                  -- backstop: re-verify the ACTUAL candidate for any resident copy of a DETECTED value
Phase 4 → Phase 4 (scrub): ∀ s ∈ sites : value_site(s) ∧ occurs(value(s), candidate) → scrub(candidate, s) → append Redaction for the location → re-verify  -- a re-materialized / incompletely-scrubbed copy (value site only): deterministic find-replace of a KNOWN value (terminating); NOT a classifier re-run, which could not relocate an undetected value
Phase 4 → Phase 1 (next pass): ¬fixed_point ∧ candidate changed enough to re-scan → re-scan → pass_n += 1
Phase 4 → converge: redaction_complete ∧ emit_clean ∧ residuals_surfaced → emit RedactedContext
Phase n → deactivate (ungraceful): user Esc at Phase 3 → the surfaced load-bearing secret untreated; no RedactedContext emitted (the detected values are already scrubbed in the candidate, but the routing is unsettled)
```

```
── LOOP ──
J = {scrub, next_pass, converge, esc}
  scrub:     ∀ s ∈ sites : value_site(s) ∧ occurs(value(s), candidate) → deterministically scrub the resident copy (find-replace the known value) → re-verify (Phase 4 self-edge)
  next_pass: ¬fixed_point ∧ the candidate changed enough to warrant a re-scan → Phase 4 → Phase 1, pass_n += 1
  converge:  redaction_complete ∧ emit_clean ∧ residuals_surfaced → emit RedactedContext, deactivate
  esc:       user Esc at the Phase 3 gate → ungraceful deactivate (the surfaced load-bearing secret's routing unsettled; no RedactedContext)

Two-layer defense: the Phase 2 front-door redaction is the real protection — it scrubs each detected value at EVERY occurrence, so the candidate carries placeholders, not values. The Phase 4 emit-scan is the backstop — it re-verifies the ACTUAL candidate output and catches a straggling copy of a detected value (an incompletely-scrubbed or re-materialized occurrence), scrubbing it deterministically. The backstop verifies what was intended against what the output actually contains; it does not extend detection.

Termination (no liveness trap): a backstop scrub is a deterministic find-replace of a positively-KNOWN value — it removes every owned occurrence in one step and strictly decreases the resident-value set, so it terminates. The emit-scan scrubs EVERY value site whose value still occurs, so a surviving occurrence is always cleared by the site OWNING its location — the global emit_clean check and the owner-local scrub stay aligned, with no occurrence stranded at a non-owning site that cannot clear it. This is categorically different from re-running the secret-pattern classifier on undetected content, which could re-miss; the backstop never does that. A value that was never classified as a secret (a true detection miss) is therefore out of reach of both layers — see Known Limitations; it is surfaced as a residual risk, never silently claimed-handled.

Single-count discipline: a load-bearing secret is carried by |unsurfaced_residual| until the gate routes it; a straggling copy is removed by the deterministic scrub within the settle step (it never accrues a separate residual or a separate measure leg), so the measure cannot double-count and stays weakly decreasing.

Convergence evidence: at convergence, present the transformation trace — per redacted secret, (item, location → kind → placeholder), plus each load-bearing secret's out-of-band disposition (Route locus / Supply / Drop) — the value never reproduced — plus the emit-scan result (clean). The RedactedContext is presented as a separate session-text artifact. Convergence is demonstrated, not asserted.
```

```
── CONVERGENCE ──
converge iff redaction_complete ∧ emit_clean ∧ residuals_surfaced ∧ ¬user_esc
  redaction_complete: ∀ s ∈ Λ.sites : settled(Λ, s)                                                  -- every detected site handled: a value site scrubbed to a placeholder, a command-substitution locus preserved as a grounded pointer; i.e. unredacted_sites(Λ) = ∅
  emit_clean:         ∄ s ∈ Λ.sites : value_site(s) ∧ occurs(value(s), candidate)                   -- no DETECTED secret VALUE survives anywhere in the candidate (the backstop's fixed point; scanned over value sites only — a preserved command-substitution locus carries no in-context value; reachable because scrub removes every occurrence of a known value)
  residuals_surfaced: unsurfaced_residual(Λ) = ∅ ∧ ∀ r ∈ Λ.residual : r.disposition ≠ ⊥             -- every load-bearing secret routed out-of-band, none silently dropped
  user_esc:           user exits via Esc at a Phase 3 gate (ungraceful; the surfaced load-bearing secret's routing untreated, no RedactedContext)
progress(Λ) = |unredacted_sites(Λ)| + |unsurfaced_residual(Λ)|  -- monotone hygiene measure, weakly decreasing per pass: Phase 2/4 scrubbing drives |unredacted_sites| → 0 (each scrub removes a known value at every occurrence, so emit_clean is restored within the settle step, not deferred to a residual), and gate routing drives |unsurfaced_residual| → 0. No separate secret / emit measure leg, so no double-count
```

```
── TOOL GROUNDING ──
-- Realization: Constitution → present + Stop (yield turn); Extension → present + Proceed
Phase 0 Detect    (sense)        → Internal analysis (silent — secret-presence scan + read-only bind of next_task; no user output)
Phase 0 relay     (extension)    → present + Proceed (no secret-shaped content → present "already secret-free" as relay, deactivate)
Phase 1 Scan      (observe)      → Read, Grep, Glob (secret-shaped scan over the working context — credentials, tokens, keys, command-substitution refs — per (item, location); reference-only over the source W)
Phase 1 classify  (track)        → Internal analysis (assign secret_kind per site; Emergent(Secret) for an unlisted shape)
Phase 2 Redact    (transform)    → Internal transform (scrub each detected value to a placeholder at every occurrence via find-replace of the known value; a command-substitution form keeps its retrieval command; the value is never stored in the ledger; a load-bearing site appends a residual surfaced = false)
Phase 3 Qc        (constitution) → present (mandatory; per load-bearing secret over Disposition {Route, Supply, Drop} — surfaced by kind + location + placeholder, never by value; Esc → ungraceful exit, not an Answer)
Phase 4 Settle    (transform)    → Internal transform + state update (emit_scan: for any detected value still resident in the candidate, deterministically scrub the copy — find-replace the known value — and append a Redaction; then check fixed_point and the pass counter. No re-run of the classifier; no separate secret measure leg)
converge          (extension)    → present + Proceed (per-secret redaction trace (item, location → kind → placeholder) + each load-bearing out-of-band disposition + emit-scan-clean result + RedactedContext as a separate session-text artifact, never reproducing a value; proceed — the context flows to /distill)
```

```
── MODE STATE ──
Λ = { phase: Phase, working_context: W,
      next_task: Option(Task),                  -- read-only; declared next task that makes a secret load-bearing
      pass_n: Nat,
      sites: Set(SecretSite),                   -- detected (item, location, kind) secret loci (Phase 1)
      redactions: RedactionLedger,              -- interceptions keyed per (item, location); NO value field — the secret VALUE never enters the ledger or any emit channel
      residual: Set(Residual),                  -- load-bearing secrets pending out-of-band routing; silent residual forbidden (surfaced = true before convergence)
      candidate: Overlay(W),                    -- the emit candidate as a redaction overlay over the read-only source: placeholder substitutions, NOT a materialized copy of W's content
      history: List<(SecretSite, Disposition)>, -- appended at Phase 3 integrate, one per routed load-bearing secret (kind + location + disposition, never the value)
      active: Bool, cause_tag: String }         -- cause_tag set at Phase 0 activation (the trigger that activated the mode)
-- Invariant: no Λ field persists a secret VALUE — value(s) is a read-only projection over the session-side source W, used transiently for scrub and the emit-scan, never stored into redactions, residual, history, or the candidate (an overlay of placeholders, not raw content)
-- Invariant: a multi-secret item is keyed per (item, location) across redactions and residual (Redaction over Item) — a second secret in one item is a distinct entry, never collapsed onto the item
```

```
── COMPOSITION ──
*: Apokrypsis is NOT a graph-node EP protocol — secret/credential policy is substrate-adjacent (it surfaces and classifies, then delegates enforcement by handoff), so it is packaged as a specialized plugin rather than registered in the protocol dependency graph. Its composition with the protocols is the prose secret-free-context contract, not a graph edge:
  • → /distill (Diylisis) — RedactedContext IS the secret-free working context /distill assumes (distill's boundary note: "secret redaction is a separate concern handled upstream by a dedicated redaction agent, not part of the distill morphism"). Run /redact, then /distill on the result. Apokrypsis earns the assumption /distill states.
  • → /attend (Prosoche), → any portable-emit step — the same upstream relationship: redact before externalizing a context that crosses a boundary.
Apokrypsis REDACTS but does NOT distill (no deictic / grounding / provenance / compression work — that is /distill), does NOT enforce credential storage (it records the disposition; routing a value to a vault or transmitting it is delegated to the harness / specialized tooling), and does NOT decide whether a secret is load-bearing unilaterally (the user constitutes the disposition at the gate).
```

## Core Principle

**Value Never Emitted**: A secret's *value* is the one thing that must never propagate. Apokrypsis scrubs each detected secret value — at every occurrence in the candidate — and replaces it with a placeholder **before** the context can be emitted, handed off, or distilled. The front-door pass is the real protection, so the normal path carries a placeholder, not the value. The interception is recorded by kind and location only; the value is never stored in any ledger, never reproduced in any surfacing, never carried into any emit channel. A secret is surfaced — at the gate, in the convergence trace — only by what it *is* (kind) and *where* (location), never by what it *says*.

**Conceal over Erase**: Concealment removes the value, not the means to re-obtain it. A command-substitution form (`$(vault read secret/db-password)`) is itself a *retrieval locus*, not a value — it survives as a grounded pointer, and only a separately-inlined resolved value is scrubbed. A **load-bearing** secret — one the declared next task genuinely needs — is never silently dropped: it is surfaced for the user to route out-of-band (a stable retrieval pointer, or out-of-band supply at use time), so the recipient can re-obtain it. The distinction the protocol protects is *value vs. locus*: the value is concealed, the locus is kept.

**Front door plus backstop**: Two layers over the actual output. The Phase 2 front-door redaction scrubs every detected value at every occurrence — a copy at an unkeyed location is removed by the same find-replace of the known value. The Phase 4 emit-scan backstop re-verifies the *actual* candidate output and deterministically scrubs any straggler — an incompletely-scrubbed or re-materialized copy of a detected value. The backstop verifies intent against output; it scrubs only *known* values, so it always terminates. What it does **not** do is recover a value that was never recognized as a secret in the first place — that true detection miss is out of reach of both layers and is surfaced as a residual risk (see Known Limitations), never silently claimed-handled.

## Mode Activation

### Activation

AI detects secret-shaped content in a working context about to cross a boundary (emit, handoff, distill, paste, commit) OR the user calls `/redact`. Detection is silent (Phase 0); scrubbing the values is an internal transform (Phase 2); routing a load-bearing secret out-of-band requires user interaction (Phase 3) unless no secret is load-bearing (relay).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/redact` slash command or description-matching input. Always available. Typically run just before `/distill` or any portable emit.
- **Layer 2 (AI-guided)**: secret-shaped content detected in a context about to be externalized. The AI surfaces the finding and the proposed redaction; routing a load-bearing secret is confirmed at the Phase 3 gate.

**Secret present** = the working context contains at least one `secret_shaped` value.

Gate predicate:
```
secret_present(W) ≡ ∃ item ∈ items(W) : secret_locations(item) ≠ ∅
  secret_locations(item) ≡ the sub-item locations whose content matches a secret pattern (credential / token / api-key / private-key / password literal or assignment, or a command-substitution secret reference)
```

### Priority

<system-reminder>
When Apokrypsis is active:

**Supersedes**: Emitting, handing off, or distilling a working context before its secret values are redacted
(A secret value must never reach an emit channel — redaction precedes externalization)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 3, present each load-bearing secret — by kind, location, and placeholder, never by value — for the user to route out-of-band via Cognitive Partnership Move (Constitution).
</system-reminder>

- Apokrypsis completes (emits the RedactedContext) before the context is distilled or externalized
- Loaded instructions resume after the values are scrubbed and load-bearing secrets routed, or Esc

### Trigger Signals

Heuristic signals for secret-present detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Credential / token / key literal | A password, API key, bearer token, or private-key block sits inline in the context |
| `export X=…`, `Authorization: …` | A secret assignment or header carries a value that must not propagate |
| Command-substitution form | A `$(vault read …)`, backtick substitution, or secret-resolving variable expansion is present — the locus is kept, an inlined value scrubbed |
| About to distill / hand off | A context with secret-shaped content is about to be externalized to a fresh session |

**Skip**:
- The context contains no secret-shaped content → relay "already secret-free", deactivate
- The context stays session-local and is never emitted, handed off, or distilled
- The user explicitly accepts the secret value for the intended (trusted, same-session) recipient

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Fixed point reached (every detected value scrubbed, candidate verified clean, every load-bearing secret routed) | Emit RedactedContext as a separate session-text artifact |
| Phase 0 finds no secret-shaped content | Relay "already secret-free; nothing to redact", deactivate |
| No load-bearing secret (all scrubbed values are droppable) | Scrub, emit-scan clean, emit RedactedContext directly (no gate) |
| User Esc at the Phase 3 gate | Ungraceful exit — the surfaced secret's routing untreated, no RedactedContext emitted |

## Protocol

### Phase 0: Secret-Presence Checkpoint (Silent)

Verify the context carries a secret and bind the declared next task. This phase is **silent** — no user interaction and no user-visible output.

1. **Probe the working context** `W` for any `secret_shaped` content across its items.
2. **Bind `next_task`** (read-only) when one is declared — it is what makes a secret load-bearing.
3. **Relay or init**:
   - If no item carries a secret-shaped value, present "already secret-free; nothing to redact" as relay and deactivate.
   - Otherwise initialize loop state (`pass_n = 1`, `sites = ∅`, `redactions = ∅`, `residual = ∅`, `candidate = overlay(W)`, `history = ∅`) and proceed to Phase 1.

**Scope restriction**: Read-only investigation over the source `W`. Does NOT mutate the source, write to any store, or transmit any value.

### Phase 1: Scan + Classify

Detect every secret locus and classify it.

1. **Per-`(item, location)` scan** — read the working context (Read/Grep/Glob over the items) for secret-shaped content. One item may carry more than one secret; each is a distinct `(item, location)` site. The site key is `(item, location)`, never per-item — a second secret in the same item is keyed separately.
2. **Classify** — assign each site a `secret_kind`: Credential, Token, ApiKey, PrivateKey, Password, or CommandSubstitutionRef. An unlisted shape classifies as `Emergent(Secret)` and is redacted all the same — the named set is a working hypothesis, not a closed taxonomy.

**Scope restriction**: Read-only over the source. `value(s)` is read transiently for the scrub and the later emit-scan; the value is never persisted into `Λ`.

### Phase 2: Redact (Front Door)

Scrub every detected value and partition the load-bearing secrets.

1. **Scrub each detected value** — for each **value** site, `scrub(candidate, s)`: replace **every** occurrence of that value in the candidate (never in the source, which stays read-only) with the placeholder `[REDACTED:{kind}@{location}]`, and append a `Redaction{item, secret_kind, placeholder, location}` per scrubbed location — by kind and location only, **never** a value field. Scrubbing every occurrence of the known value means a copy at a second, unkeyed location is removed by the same front-door pass.
2. **Preserve the retrieval locus** — for a command-substitution form (`$(vault read …)`, a backtick substitution, a secret-resolving variable expansion), the form *is* the retrieval locus: keep it as a grounded pointer and scrub only a separately-inlined resolved value. The recipient re-obtains the secret out-of-band through the preserved command. Preserving the locus is how a command-substitution site is *settled* — it carries no in-context value, so no value scrub is forced at the locus and convergence stays reachable; a separately-inlined resolved value is a distinct value site, scrubbed normally.
3. **Partition load-bearing** — any load-bearing site the declared `next_task` plausibly needs (the AI's hypothesis) appends a `Residual{site, surfaced = false}` so it surfaces at the Phase 3 gate: a scrubbed **value** site carries its location + placeholder; a preserved **command-substitution locus** carries its location + retrieval command (the Route pointer). A site the next task does not need carries no residual — its placeholder, or its preserved locus, simply remains.

**Scope restriction**: Internal transform over the candidate overlay. No store write, no transmission. This is an Extension operation — the scrub is deterministic given the detection; the only Constitution interaction is the gate below.

### Phase 3: Out-of-Band Routing Gate (Constitution)

**Present** each load-bearing secret for the user to route out-of-band via Cognitive Partnership Move (Constitution). If `residual = ∅` (no load-bearing secret), skip the gate — this is relay. The value is already scrubbed in the candidate either way; this gate routes only how the recipient re-obtains it.

**Surfacing format** — present as text output *before* the gate (Context-Question Separation), per secret, **never reproducing the value**:
- **Kind + location**: the secret's `secret_kind` and where it sits (`item`, `location`)
- **Placeholder**: the `[REDACTED:{kind}@{location}]` token now standing in the candidate
- **Why load-bearing**: the part of the declared `next_task` that the AI infers needs it (a hypothesis the user can revise)
- **Retrieval locus** (if any): the preserved command-substitution form the recipient can resolve

Then **present**:

```
How should this load-bearing secret be re-obtained by the recipient?
(The value is already redacted in the context — this routes only how it is re-obtained out-of-band.)

Options:
1. **Route** — carry it by a stable retrieval pointer the recipient resolves out-of-band: [vault path / secret-store key / the preserved command]
2. **Supply** — no stable pointer; the recipient supplies the value out-of-band at use time: [what to inject, and where]
3. **Drop** — the next task does not actually need it; release it (the placeholder remains, the value is already gone)
```

**Design principles**:
- **Value never shown**: the gate surfaces the secret by kind + location + placeholder; the value is never in the surfacing text, the options, or the trace.
- **One secret per gate entry**: each load-bearing secret is a distinct gate entry, keyed per `(item, location)` — a multi-secret item presents its secrets separately.
- **Enforcement delegated**: Route and Supply *record* what the recipient must do out-of-band; Apokrypsis does not itself write to a vault or transmit the value (substrate boundary).

### Phase 4: Settle (Emit-Scan Backstop)

Re-verify the actual candidate and decide convergence.

1. **Emit-scan** — for every detected **value** site (a command-substitution locus carries no in-context value and is preserved, so it is not scanned), test whether its value still occurs anywhere in the candidate (`occurs(value(s), candidate)`). A hit means a copy of a *detected* value survived — an incompletely-scrubbed or re-materialized occurrence.
2. **Deterministically scrub the straggler** — if the emit-scan finds a resident value, `scrub(candidate, s)` it (find-replace the known value at every occurrence) and append a `Redaction` for the location. This is positive and terminating — it removes the value, never re-runs the classifier. It does **not** route to the gate: scrubbing a copy of an already-detected secret introduces no new out-of-band routing decision.
3. **Measure progress** — `progress(Λ) = |unredacted_sites| + |unsurfaced_residual|`, weakly decreasing per pass. Scrubbing drives `|unredacted_sites| → 0` and restores `emit_clean` within the settle step; gate routing drives `|unsurfaced_residual| → 0`.
4. **Route**:
   - If `redaction_complete ∧ emit_clean ∧ residuals_surfaced`: emit the RedactedContext, converge.
   - If a straggler was scrubbed: re-verify (Phase 4).
   - If the candidate changed enough to warrant re-scanning: loop to Phase 1, `pass_n += 1`.
   - If the user pressed Esc at the gate: ungraceful deactivate (the surfaced secret's routing untreated).

## Known Limitations

- **True detection miss is out of reach**: both layers rely on the same `secret_shaped` detector. A value the detector never classifies as a secret is neither scrubbed at the front door nor found by the emit-scan (which can only locate *known* values). Apokrypsis does not claim to recover a true detection miss — it is a residual risk, surfaced honestly rather than masked by a backstop that cannot see it. Mitigations are detector breadth (the open `Emergent(Secret)` class) and user review of the redaction trace, not a silent re-scan.
- **Detection is heuristic**: `secret_shaped` is a pattern judgment, so a novel secret shape may be missed (above) or a non-secret may be over-redacted (a false positive scrubs a value the next task needed — recoverable: the user re-supplies it). The protocol favors over-redaction over leakage.
- **Enforcement is delegated**: Route / Supply record the out-of-band action; Apokrypsis does not perform the vault write or the credential transmission (substrate boundary).

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | A handful of secrets, none load-bearing | Brief redaction trace + emit-scan-clean confirmation; no gate |
| Medium | Several secrets, one or two load-bearing | Per-secret redaction trace + per-load-bearing gate entry (kind + location + placeholder + retrieval locus) |
| Heavy | Many secrets, command-substitution forms, values copied across locations | Detailed per-site trace + careful command-substitution locus preservation + emit-scan iterated until the candidate is verified clean |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Apokrypsis) only if secret_present(W)` | Prevents false activation on a context with no secret-shaped content |
| Value never stored | `Redaction` has no value field; `value(s)` is a transient read-only projection | The secret value never enters any ledger, surfacing, emit channel, or the candidate overlay |
| Per-(item, location) keying | Each secret keyed by `(item, location)` | A second secret in one item is scrubbed and routed distinctly, never collapsed |
| Scrub collision policy | Sites scrubbed longest-value-first; each occurrence keyed to the site owning its location | No longer-secret fragment survives a shorter-first scrub; duplicate values keep distinct per-location placeholders; an unkeyed copy is still caught |
| Front door + backstop | Phase 2 scrub + Phase 4 emit-scan re-verify | A re-materialized or incompletely-scrubbed copy is caught by re-checking the actual output |
| Deterministic, terminating | A backstop scrub is find-replace of a KNOWN value | No liveness trap: it removes every occurrence and strictly decreases the resident set; never re-runs the classifier |
| Honest detection-miss scope | A never-classified value is surfaced as a Known Limitation | The backstop does not claim to catch detection misses it cannot see |
| Command-substitution locus | The retrieval command is preserved; only an inlined value is scrubbed | The recipient re-obtains the secret out-of-band; value and locus stay distinct |
| Load-bearing routed | A needed secret surfaces at the gate (Route / Supply / Drop) | A needed secret is never silently dropped; the value is never emitted |
| Enforcement delegated | Route / Supply record the out-of-band action; Apokrypsis never writes a store | Credential enforcement is substrate, delegated by handoff at the gate |
| Single-count measure | A straggler is scrubbed in-step, never accrues a residual | No double-count; the measure stays weakly decreasing (no non-termination) |
| Convergence evidence | Per-secret trace (item, location → kind → placeholder) + dispositions + emit-scan-clean | Convergence is demonstrated by the transformation trace, never reproducing a value |
| Esc semantics | Esc → ungraceful exit; the surfaced secret's routing untreated | Distinguishes a hard exit from a completed redaction |

## Rules

1. **AI-detects-and-scrubs, user-routes**: AI scans, classifies, and scrubs each secret value (Extension — deterministic given detection); routing a **load-bearing** secret out-of-band requires user choice via Cognitive Partnership Move (Constitution) at Phase 3 over `Disposition`. The scrub itself is never gated — only the out-of-band routing of a needed secret is.
2. **Value Never Emitted (invariant)**: No detected secret value reaches any emit channel, ledger, surfacing, trace, or the candidate overlay. `Redaction` records kind + location only; `value(s)` is a read-only projection used transiently for the scrub and the emit-scan occurrence test. A secret is surfaced by kind + location + placeholder, never by value.
3. **Per-(item, location) keying**: One context item may carry multiple secrets; each is keyed by `(item, location)`, not per-item, so a second secret in the same item is scrubbed, recorded, and routed as a distinct entry — never collapsed onto the item.
4. **Conceal over Erase**: For a command-substitution form, the retrieval command is preserved as a grounded pointer; only a separately-inlined resolved value is scrubbed. The form is a locus, not a value — the recipient re-obtains the secret out-of-band through it. Value and retrieval locus stay distinct.
5. **Load-bearing routed, not dropped**: A secret the declared next task genuinely needs is surfaced at the gate and routed out-of-band (Route / Supply), never silently dropped. `load_bearing` is the AI's hypothesis; the user confirms it (Route / Supply) or revises it (Drop). The value is never emitted; the recipient re-obtains it out-of-band.
6. **Two-layer defense over the actual output**: The Phase 2 front-door scrub removes each detected value at every occurrence (the real protection). The Phase 4 emit-scan backstop re-verifies the actual candidate and scrubs any straggling copy of a detected value. The backstop verifies intent against output; it does not extend detection.
7. **Deterministic scrub, no classifier re-run (termination)**: A backstop scrub is a find-replace of a positively-KNOWN value — it removes every occurrence and strictly decreases the resident-value set, so it terminates. It is never a re-run of the secret-pattern classifier (which could re-miss). A value the classifier never recognized is out of reach of both layers and is surfaced as a Known Limitation, not silently re-scanned.
8. **Single-count discipline**: A load-bearing secret is carried by `|unsurfaced_residual|` until the gate routes it; a straggling copy is removed by the deterministic scrub within the settle step and never accrues a separate residual or measure leg. The monotone progress measure stays weakly decreasing and the loop terminates.
9. **Silent-residual ban**: Every load-bearing secret enters the residual with `surfaced = false` and must reach `surfaced = true` with a bound out-of-band disposition before convergence. No load-bearing secret is set aside silently.
10. **Open taxonomy**: The `Secret` set (Credential, Token, ApiKey, PrivateKey, Password, CommandSubstitutionRef) is a working hypothesis, not a closed taxonomy — an unlisted shape classifies as `Emergent(Secret)` and is scrubbed all the same.
11. **Enforcement delegated (substrate boundary)**: Apokrypsis surfaces, classifies, and records each secret's disposition — the epistemic work — but does not enforce external substrate semantics. It never writes a value to a vault, mutates a secret store, or transmits a credential; Route / Supply record what the recipient must do out-of-band, and enforcement is delegated by handoff at the gate.
12. **Option-set relay test (Extension classification)**: When no secret is load-bearing, there is nothing to route — present the redaction trace directly as relay, no gate. Each Constitution option (Route / Supply / Drop) must be genuinely viable under different user value weightings; options sharing a downstream trajectory collapse to one.
13. **Gate integrity** (Safeguard tier): The defined option set (`A ∈ Disposition = {Route, Supply, Drop}`) is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (filling `Route` with a concrete vault path while preserving the coproduct) is distinct from mutation.
14. **Context-Question Separation**: The secret's kind, location, placeholder, why-load-bearing, and retrieval locus all appear as text before the gate; the gate contains only the essential question and option-specific differential implications — and never the value. Embedding context in question fields is a protocol violation.
15. **Convergence evidence**: At convergence, present the per-secret transformation trace (item, location → kind → placeholder), each load-bearing secret's out-of-band disposition (Route locus / Supply / Drop), and the emit-scan-clean result — never reproducing a value. The RedactedContext is a separate session-text artifact. Convergence is demonstrated, not asserted.
16. **Plain emit discipline**: User-facing emit (gate surfacing prose, convergence traces, gate options, any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token carries decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
17. **Round-local salience bundling**: Each user-facing round bundles the current secret, its nearest evidence (kind, location, why-load-bearing), and the differential implication of each disposition that matters for the next move. Keep adjacent material together so the user recognizes the routing decision without context-switching; defer background and unrelated findings to pre-gate text or the convergence trace.
18. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
19. **Compose, do not reimplement**: Apokrypsis carries ONE responsibility — concealing secret values while preserving their retrieval loci. It is the upstream pass that earns `/distill`'s secret-free-context assumption; it does no deictic / grounding / provenance / compression work (that is `/distill`). It is not a graph-node EP protocol — its composition with the protocols is the prose secret-free-context contract, not a graph edge.
20. **Scrub collision policy**: Value sites are scrubbed longest-value-first, so a value that contains another as a substring is replaced whole before its substring — no fragment of a longer secret survives and the emit-scan cannot pass on a partially-corrupted value. Each occurrence is replaced with the placeholder of the site that owns its location; an identical value at another detected location is left to that site's own scrub, so duplicate values keep distinct per-(item, location) placeholders and ledger rows, while a copy at an unkeyed location is attributed to the scrubbing site.
