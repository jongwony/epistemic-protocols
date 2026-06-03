---
name: distill
description: "Distill a session-tethered working context into a self-contained portable handoff a fresh zero-memory agent can execute from. Closes deictic, grounding, relevance, provenance, and compression gaps, then emits a prose channel plus a schema-versioned TaskStateBlock. Type: (ContextTethered, AI, DISTILL, WorkingContext) → PortableHandoff. Alias: Diylisis(διύλισις)."
---

# Diylisis Protocol

Distill a session-tethered working context into a self-contained portable handoff through deictic, grounding, relevance, provenance, and compression closure, resolving context-tethered residue into a handoff a fresh zero-memory agent can execute from. Type: `(ContextTethered, AI, DISTILL, WorkingContext) → PortableHandoff`.

## Definition

**Diylisis** (διύλισις: refining, distillation): A dialogical act of distilling a session-tethered working context — the accumulated context window of one working session, carrying undefined jargon, metric tokens, author process traces, tool state, and dangling task identifiers — into a self-contained portable handoff that a fresh recipient with no access to the author session can execute from. The protocol's lexical verb is `/distill`. The author session declares a handoff contract, normalizes each session-local pointer (deixis) to a canonical reference, audits each item for self-containment, judges each item's recipient-relevance and transformation-provenance, compresses to the minimal-complete set, gates the result against a zero-memory comprehension standard, loops until a monotone hygiene measure reaches its fixed point, and emits the handoff across a prose channel and a schema-versioned task-state channel.

```
── FLOW ──
Diylisis(W, recipient?, next_task?) → Detect(W) → tethered? →
  ¬tethered: → deactivate (handoff already self-contained)
  tethered:  pass_n=1, ledger = read(CorrectionDelta) | unknown, residuals = ∅, loop:
    F0 declare(recipient, next_task, allowed_sources, scope, stop) → contract                -- relevance + minimality premise
    F1 scan(deixis) → normalize(surface_token → canonical_ref, confidence, unresolved?) → SubstTable
       |unresolved tokens| > 0: append to residuals (reason: unresolved)
    F2 audit(item, self_containment) → classify(inline | stable-pointer | routed-residual)    -- no silent residual
    F3a relevance(item, contract.next_task) → keep_candidate?                                   -- F0 contract predicate
    F3b provenance(item, ledger) → Provenance →
         CorrectionDelta(KEEP, status≠provisional):  → CorrectedKeep  → KEEP
         else (ledger unknown ∨ no match ∨ provisional-only ∨ non-KEEP delta):  → Unknown → Constitution(ASK)   -- provenance authority is the KEEP hard line only; no KEEP inferred without a matching non-provisional KEEP delta
    F3  disposition(item) ← Disposition: KEEP(inline) | ROUTE(StableRef) | DROP                 -- KEEP from CorrectedKeep; ROUTE/DROP from F3a relevance or the Gate; Unknown ∨ conflict → Gate
    F4 compress(kept) → minimal_complete                                                        -- remove only if no contract/residual violation
    F5 comprehension_gate(minimal_complete, contract) → zero_memory_verdict →                    -- lint checklist or fresh subagent; no self-simulation
         Fail(blocking_items): append to residuals (reason: comprehension-gap), block fixed_point
         Pass:                 no new residual
       Gate Qd(disposition conflicts ∪ unknown-provenance ∪ unresolved residuals) → Stop → A    -- Constitution surfacing (both verdicts; residuals incl. comprehension-gap)
    F6 loop: measure(unresolved anchors, stop, schema, residual, leaked drops) decreasing → fixed_point?  -- leak lint: DROP'd content absent from emit (minimality dual of F5)
         ¬fixed_point: pass_n += 1, loop (one-pass + bounded audit/lint)
         fixed_point: → F7
    F7 emit(prose_channel, TaskStateBlock) → PortableHandoff → converge                       -- leak_free: no DROP'd content in any emitted channel

── MORPHISM ──
WorkingContext, recipient?, next_task?
  → declare(recipient, next_task, allowed_sources, scope, verification, stop)  -- F0 HandoffContract; relevance and minimality undefined without it
  → normalize(surface_token, canonical_ref, confidence)                        -- F1 deictic closure: precedes grounding so each grounded item names a stable referent
  → audit(item, self_containment) → (inline | stable-pointer | routed-residual)-- F2 grounding closure: silent residual surfaced, never dropped unseen
  → select(item, contract.next_task)                                           -- F3a recipient-relevance predicate against the declared contract
  → attest(item, CorrectionDelta_ledger) → Provenance                          -- F3b read-only provenance; a matching non-provisional KEEP delta yields CorrectedKeep, every other ledger state yields Unknown; provenance authority is the KEEP hard line only, never an inferred disposition
  → dispose(item) → Disposition                                               -- F3 KEEP(inline) | ROUTE(StableRef) | DROP
  → compress(kept) → minimal_complete                                          -- F4 remove only what leaves no contract or residual-ledger violation
  → gate(minimal_complete, contract) → zero_memory_verdict                     -- F5 comprehension against a fresh recipient standard; Fail re-enters blocking items as residuals, no author self-simulation
  → settle(measure) → fixed_point                                             -- F6 bounded audit/lint loop on a monotone hygiene measure; fixed_point requires a Pass verdict ∧ leak_free (no DROP'd content in emit)
  → emit(prose_channel, TaskStateBlock)                                        -- F7 channel separation; the task-state channel never overrides prose authority
  → PortableHandoff
requires: context_tethered(W)                -- runtime checkpoint (Phase 0)
deficit:  ContextTethered                    -- activation precondition (Layer 1/2)
preserves: source_chain(W)                   -- W.items read-only; substitution, disposition, and provenance annotate, never mutate the originating context
invariant: Portability over Author Familiarity

── TYPES ──
W              = WorkingContext { items: List(ContextItem), session_ref: SessionRef, action: Handoff }
ContextItem    = { content: String, origin: Origin, surface_tokens: Set(String), downstream: List(TaskRef) }
Origin         ∈ {UserStatement, DocumentRead, ToolOutput, AIInference, PriorTask} ∪ Emergent(Origin)
recipient?     = Optional(RecipientProfile)                  -- defaults to "zero-memory fresh agent" when absent
next_task?     = Optional(String)                            -- declared at F0; absence forces F0 elicitation before relevance is defined
Detect         = W → (Bool, tethered_items if true)          -- F0 precheck for session-tethered residue
StableRef      = { kind: "path" | "url" | "id" | "command", locator: String }  -- a reference resolvable without the author session
InlineEvidence = { content: String }                         -- evidence carried inline rather than by reference
HandoffContract { recipient_profile: "zero-memory fresh agent"; next_task: String;
  allowed_sources: List(StableRef); execution_scope: String; verification_commands: List(String);
  stop_condition: String; residual_unknown_policy: Map(String, "KEEP" | "ROUTE" | "DROP" | "ASK") }
                 -- F0 output; the contract every later phase reads for relevance and minimality
SurfaceToken   = String                                      -- a session-local deictic token (undefined jargon, metric shorthand, "as above", a bare task id)
Substitution   = { surface_token: SurfaceToken; canonical_ref: StableRef | InlineEvidence | Null;
                   confidence: Float; unresolved: Bool }     -- F1 row; unresolved = true routes the token to the residual ledger
SubstTable     = List(Substitution)
Grounding      ∈ {Inline(InlineEvidence), StablePointer(StableRef), RoutedResidual(reason: String)}  -- F2 per-item self-containment class
CorrectionDelta { id: String; subject_ref: StableRef; claim_kind: String; original_ref: Option(StableRef);
  original_claim_hash: Option(String); corrected_claim: String;
  correction_basis_ref: StableRef | InlineEvidence; corrected_at: Timestamp;
  corrected_by: "User" | "Tool" | "AI"; supersedes: List(String); validity_horizon: Option(Duration);
  export_policy: "KEEP" | "ROUTE" | "DROP";
  verification_status: "observed" | "user_confirmed" | "tool_confirmed" | "provisional" }
                 -- append-only correction record; F3b's sole authority. v1 consumes the ledger read-only.
effective_delta(item) = most-recent non-superseded d ∈ ledger : d.subject_ref = ref(item)   -- ∅ when ledger absent or no match; supersedes-chain resolved to the live record
corrected_in_session(item) = effective_delta(item) = d ∧ d.export_policy = "KEEP" ∧ d.verification_status ≠ "provisional"
provenance(item) = CorrectedKeep  if corrected_in_session(item)
                 | Unknown        otherwise (ledger absent ∨ no match ∨ only-provisional match ∨ a non-KEEP delta)
Provenance     ∈ {CorrectedKeep, Unknown}  -- F3b verdict, a CorrectedKeep-or-complement partition: CorrectedKeep requires an effective matching non-provisional KEEP CorrectionDelta; Unknown otherwise (ledger absent, no match, provisional-only, or a non-KEEP delta). Provenance authority is the KEEP hard line only — ROUTE/DROP dispositions come from F3a relevance or the Gate, not from a provenance verdict
Disposition    = KEEP(InlineEvidence) | ROUTE(StableRef) | DROP            -- F3 3-way coproduct
ResidualLedger = Set({ item: ContextItem, reason: "unresolved" | "unknown-provenance" | "comprehension-gap", surfaced: Bool })  -- silent residual forbidden: every entry must have surfaced = true before convergence
A              = User answer ∈ {Resolve(canonical_ref), Route(StableRef), Drop, Defer(condition)}
                 -- Gate coproduct for surfaced residuals and unknown-provenance items; presented intact
Qd             = Residual + disposition-conflict gate [Tool: Constitution interaction]
ZeroMemoryVerdict ∈ {Pass, Fail(blocking_items: Set(ContextItem))}  -- F5 comprehension verdict; Fail names the items a fresh recipient cannot resolve, which re-enter the residual ledger (reason: comprehension-gap) and block the fixed point
TaskStateBlock = { schema_version: String; tasks: List({ id: String; subject: String; description: String;
                   restore_status: "pending"; source_ref: StableRef }) }  -- F7 structured channel; rehydrates dangling task identifiers
emit_candidate(Λ) = the candidate PortableHandoff channels before convergence: contract ∪ prose ∪ task_state ∪ residual_ledger  -- all four PortableHandoff channels (contract included — F7 emits it too); distinct from the F7 emit(·) action; this is the to-be-emitted content F6 lints
tokens(X)      = the token content extracted from channels X (strings, not the structured objects)  -- projection Channels → Set(Token), so the ⊆ test below compares homogeneous token sets
discriminating(d) = the session-local tokens that UNIQUELY identify a DROP'd item d — its distinctive content, not bare ids nor tokens shared with in-scope items  -- precision-bounded against false positives; when the boundary is uncertain, delegate the leak check to a fresh subagent (as F5 does) rather than let a common token block convergence
leaked_drops(Λ) = { d ∈ Λ.dropped : discriminating(d) ≠ ∅ ∧ discriminating(d) ⊆ tokens(emit_candidate(Λ)) }  -- DROP'd content that survived into an emitted channel; the minimality dual of the F5 comprehension-gap (F5 catches missing, this catches leaked). The ≠ ∅ guard is load-bearing: a DROP whose discriminating set is empty (no unique identifying content) has nothing distinctly leakable or excisable, so the vacuous ∅ ⊆ tokens(...) must not count it as leaked — otherwise |leaked_drops| could never reach 0 and the loop would never converge (liveness trap)
leak_free(Λ)   ≡ leaked_drops(Λ) = ∅
measure(Λ)     = |unresolved_anchors| + |unmet_stop| + |schema_gaps| + |unsurfaced_residual| + |leaked_drops|  -- F6 monotone hygiene measure, weakly decreasing per pass
fixed_point(Λ) = (measure(Λ) = 0 ∨ (measure stable ∧ all residuals surfaced ∧ leak_free(Λ) ∧ no disposition conflict)) ∧ zero_memory_verdict = Pass
PortableHandoff = { contract: HandoffContract; prose: String; task_state: TaskStateBlock; residual_ledger: ResidualLedger }
                 -- emitted when fixed_point(Λ) ∧ ¬user_esc ∧ every ResidualLedger entry surfaced ∧ leak_free(Λ)
                 -- residual_ledger here carries recipient-relevant residue only (Route-pending pointers); Drop- and Defer-resolved entries are released — their content + drop/re-trigger reason stay session-side in Λ.history, never emitted (Defer = released-not-retained per the Λ invariant; see Rule 12)
Phase          ∈ {0, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: W, recipient?, next_task? → Detect(W) → tethered?                                       -- tethered checkpoint (silent)
       then F0 declare(recipient, next_task, allowed_sources, scope, verification, stop) → HandoffContract
Phase 1: HandoffContract → F1 normalize(surface_token, canonical_ref, confidence) → SubstTable    [Tool: Read, Grep, Glob]
       then F2 audit(item, self_containment) → Grounding (inline | stable-pointer | routed-residual)
       unresolved F1 tokens and routed-residual F2 items append to ResidualLedger (surfaced = false)
Phase 2: (SubstTable, Grounding, ledger) → F3a relevance(item, contract.next_task)
       → F3b attest(item, CorrectionDelta) → Provenance
       → F3 dispose(item) → Disposition                                                          -- KEEP from CorrectedKeep (matching non-provisional KEEP delta); ROUTE/DROP from F3a relevance or the Gate; Unknown routes to Gate
Phase 3: kept → F4 compress(kept) → minimal_complete                                             -- minimal-complete (track)
       → F5 comprehension_gate(minimal_complete, contract) → zero_memory_verdict                  [Tool: Read, Task]
       → Qd(disposition conflicts ∪ unknown-provenance ∪ unresolved residuals) → Stop → A         [Tool: Constitution interaction]
Phase 4: A, verdict → F6 settle(measure) → fixed_point?
       ¬fixed_point → Phase 1 (next pass); fixed_point → F7 emit(prose, TaskStateBlock) → PortableHandoff

Phase 0 → Phase 1:  context_tethered(W) = true ∧ HandoffContract declared              -- tethered residue present, contract premise set
Phase 0 → deactivate: context_tethered(W) = false                                      -- handoff already self-contained
Phase 1 → Phase 2:  SubstTable produced ∧ every item assigned a Grounding class        -- deixis normalized, self-containment audited
Phase 2 → Phase 3:  every item carries a Disposition or a surfaced unknown-provenance flag -- relevance + provenance discharged
Phase 3 → Phase 4:  zero_memory_verdict produced ∧ A received                          -- comprehension evaluated (Pass or Fail) and residual answered; Pass gates convergence at Phase 4
Phase 4 → Phase 1:  ¬fixed_point(Λ) → pass_n += 1                                      -- measure unsettled OR comprehension verdict not yet Pass, re-audit
Phase 4 → converge: fixed_point(Λ) ∧ zero_memory_verdict = Pass ∧ every ResidualLedger entry surfaced ∧ leak_free(Λ)  -- emit PortableHandoff across both channels; no DROP'd content leaks into emit
Phase 3 → deactivate (ungraceful):  Esc                                               -- residual untreated, handoff not emitted

── LOOP ──
J = {next_pass, converge, esc}
  next_pass:  ¬fixed_point(Λ) ∧ ¬Esc → pass_n += 1, Phase 4 → Phase 1 (bounded audit/lint re-scan)
  converge:   fixed_point(Λ) ∧ every ResidualLedger entry surfaced ∧ leak_free(Λ) → emit PortableHandoff
  esc:        Esc → ungraceful deactivate (residual untreated)

One-pass + bounded audit/lint: the morphism runs once forward (F0→F7), then F6 re-audits against the monotone hygiene measure. Each pass weakly decreases `measure(Λ)`; the loop terminates at the fixed point, not on a felt sense that the handoff "reads complete."
Provenance hard line: F3b never infers KEEP from appearance. A CorrectedKeep verdict requires an effective matching non-provisional KEEP CorrectionDelta; every other ledger state — absent, no match, provisional-only, or a non-KEEP delta — yields Unknown, which routes to the Gate as a Constitution question where the author decides KEEP, ROUTE, or DROP. Provenance authority covers the KEEP hard line only: ROUTE and DROP dispositions are reached through F3a relevance or the Gate, never defaulted from a provenance verdict.
Silent-residual ban: every item classified as routed-residual at F2, every unresolved token at F1, every unknown-provenance item at F3b, and every comprehension-gap item at F5 enters the ResidualLedger with `surfaced = false` and must reach `surfaced = true` through the Gate before convergence.
Comprehension hard line: F5's verdict gates the fixed point. A Fail re-enters its blocking items into the residual ledger (reason: comprehension-gap, `surfaced = false`) and keeps the loop off its fixed point; convergence requires a Pass verdict, so a handoff never emits while the zero-memory gate fails.
Leak repair: when `leaked_drops > 0` the loop re-enters, and the repair is a targeted emit-channel revision — excise every leaked DROP'd item's discriminating content from all four emit channels — contract, prose, TaskStateBlock, and residual_ledger — then re-audit (contract excision = rewording the offending field; the contract itself is retained). Unlike the F5 repair, no item re-enters the residual ledger: a DROP was already user-decided at the Gate, so the defect is its content surviving the emit and the fix is excision from the candidate emit, not re-surfacing. Convergence is preserved because content that is load-bearing for an in-scope item belongs to that item's own KEEP/ROUTE record (retained on its own basis); only the DROP'd item's UNIQUE discriminating content is excised.
Convergence evidence: At convergence, present the substitution table (surface_token → canonical_ref → confidence → unresolved?), the per-item disposition trace (KEEP/ROUTE/DROP with provenance basis), the surfaced residual ledger, and the emitted TaskStateBlock. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff fixed_point(Λ) ∧ every ResidualLedger entry surfaced ∧ leak_free(Λ) ∧ ¬user_esc
  fixed_point(Λ):  (measure(Λ) = 0, OR measure stable across a pass with all residuals surfaced, leak_free, and no open disposition conflict) ∧ zero_memory_verdict = Pass
  surfaced ledger: ∀ r ∈ ResidualLedger : r.surfaced = true (no silent residual reaches the recipient)
  leak_free:       leaked_drops(Λ) = ∅ — no DROP'd item's discriminating content survives in any emitted channel (contract, prose, TaskStateBlock, residual ledger); the minimality dual of comprehension (F5 catches missing content, this catches leaked DROP content). Stated explicitly for emphasis though already entailed by fixed_point(Λ) (since |leaked_drops| ∈ measure), matching the surfaced-ledger and zero-memory-verdict emphasis pattern
  comprehension:   zero_memory_verdict = Pass (a Fail re-enters blocking items as residuals and forces another pass; no handoff emits on a Fail)
  user_esc:        user exits via Esc at the Phase 3 Gate (ungraceful, residual untreated, no PortableHandoff emitted)
progress(Λ) = 1 - measure(Λ) / measure(Λ_initial)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect          (sense)        → Internal analysis (silent — heuristic scan for session-tethered residue; no user output)
Phase 0 declare         (observe)      → Read, Grep (recipient, next_task, allowed_sources, scope, verification, stop from session context and project config)
Phase 1 normalize       (observe)      → Read, Grep, Glob (resolve each surface token to a canonical reference; the read-only deictic scan runs as Extension)
Phase 1 audit           (sense)        → Internal analysis (per-item self-containment classification: inline / stable-pointer / routed-residual)
Phase 2 attest          (observe)      → Read (read-only consumption of the append-only CorrectionDelta ledger; absence yields Unknown)
Phase 2 dispose         (track)        → Internal state update (Λ.dispositions, Λ.residual_ledger)
Phase 3 comprehension_gate (observe)   → Read, Task (lint checklist or fresh subagent against the zero-memory standard; author self-simulation excluded)
Phase 3 Qd              (constitution) → present (mandatory; surfaced residuals + unknown-provenance items + disposition conflicts; Esc → loop termination at LOOP level, not an Answer)
Phase 4 settle          (track)        → Internal state update (measure(Λ) incl. leaked_drops, leak-lint, fixed-point check, pass counter)
converge                (extension)    → TextPresent+Proceed (substitution table + disposition trace + surfaced residual ledger + TaskStateBlock; proceed with PortableHandoff — emit is leak_free, recipient ledger recipient-relevant only)

── MODE STATE ──
Λ = { phase: Phase, W: WorkingContext,
      contract: Option(HandoffContract),                  -- F0 output; relevance and minimality premise
      pass_n: Nat,                                         -- bounded audit/lint pass counter
      ledger: CorrectionDelta_set | Unknown,              -- read-only provenance source; Unknown when absent
      subst_table: SubstTable,                            -- F1 deictic normalization rows
      grounding: Map(ContextItem, Grounding),             -- F2 self-containment class per item
      provenance: Map(ContextItem, Provenance),           -- F3b verdict per item
      dispositions: Map(ContextItem, Disposition),        -- F3 KEEP/ROUTE/DROP per item
      kept: Set(ContextItem),                             -- F4 minimal-complete retained set
      routed: Set(ContextItem),                           -- ROUTE dispositions (StableRef-bound)
      dropped: Set(ContextItem),                          -- DROP dispositions
      gated: Set(ContextItem),                            -- items surfaced at the Gate for user judgment (unknown-provenance ∪ conflict)
      residual_ledger: ResidualLedger,                    -- unresolved + unknown-provenance items; silent entry forbidden
      task_state: Option(TaskStateBlock),                 -- F7 structured channel
      measure: Nat,                                        -- F6 monotone hygiene measure (incl. |leaked_drops|)
      zero_memory_verdict: Option(ZeroMemoryVerdict),      -- F5 comprehension verdict; Fail re-enters blocking items as residuals and blocks fixed_point
      items_touched: Set(ContextItem),                     -- every item processed: the partition universe (= items(W) once all are disposed)
      history: List<(ContextItem, Substitution, Disposition, drop_reason: Option(String))>,  -- drop_reason is the typed home for Rule 12's "preserved in Λ.history with its drop reason"; Null for non-DROP entries
      active: Bool, cause_tag: String }
-- Invariant: items_touched = kept ∪ routed ∪ dropped (pairwise disjoint)
--   terminal partition over Disposition = KEEP | ROUTE | DROP; the Gate answer Defer resolves to a dropped item carrying a re-trigger condition (released from this handoff, not retained)
--   gated is the transient pre-resolution cell, empty at fixed point: every gated item resolves to a terminal disposition (Resolve → KEEP, Route → ROUTE, Drop/Defer → DROP)
--   residual_ledger is a cross-cutting surfacing record, not a partition cell and not emptied: every entry reaches surfaced = true before convergence. The full surfaced ledger is the session-side audit trace (retained in Λ.history); only its recipient-relevant projection (Route-pending) is carried into PortableHandoff. A Drop- or Defer-resolved entry is released from the emit (Defer = released-not-retained per the Defer invariant above; its re-trigger condition is kept session-side) — its content and reason stay session-side — so the emitted handoff never reproduces DROP'd content (enforced by leak_free: leaked_drops = ∅ at fixed point)
-- Invariant: KEEP(item) ⇒ provenance(item) = CorrectedKeep ∨ user_resolved_at_gate(item) (no KEEP by inference — only via a matching non-provisional CorrectionDelta or an explicit user Resolve)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
F3b composes Elenchus's provenance and freshness tagging plus its Revised | Bounded | Routed disposition vocabulary, and owns the correction-delta ledger that Elenchus does not carry: the ledger is the read-only authority that lets F3b separate a corrected-in-session item (KEEP) from an item whose provenance is merely undecided (Unknown → Gate).
F5 reuses the comprehension structure of a result-grasp check, redirected: the recipient under verification is a fresh executor with no session access, not the author, so the gate excludes author self-simulation (which would pass items the author silently shares).
F2 may call an external-reference check (request/ground style) when a grounding pointer's target needs verification; the self-containment audit itself stays inline.
```

## Core Principle

**Portability over Author Familiarity**: A working session's context window accumulates session-tethered residue — undefined jargon, metric shorthand, author process traces, tool state, and dangling task identifiers — that reads as complete to the author because the author silently shares the missing context. A fresh recipient with no session access has none of that shared ground. Diylisis distills the working context into a handoff whose every load-bearing reference resolves without the author session: each deictic token is normalized to a canonical reference, each item is audited for self-containment, each disposition is judged against the declared recipient and its transformation provenance, and the residue that cannot be resolved is surfaced rather than silently carried. The handoff is portable when the author's familiarity is no longer a hidden dependency.

## Mode Activation

### Activation

AI detects session-tethered residue before a handoff OR the user calls `/distill`. Detection is silent (Phase 0); residual and disposition-conflict judgment always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 3).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/distill` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Session-tethered residue detected before a context handoff (writing a handoff brief, spawning a fresh-context subagent, preparing a plan a new session will resume). Detection is silent (Phase 0).

**Context tethered** = the working context carries references whose resolution depends on the author session — undefined jargon, metric tokens, "as above"-style anchors, author process narration, or task identifiers that do not transfer to a fresh session.

Gate predicate:
```
context_tethered(W) ≡ ∃ item(i, W) : depends_on_author_session(i) ∧ ¬resolvable_by_stable_ref(i)
```

### Priority

<system-reminder>
When Diylisis is active:

**Supersedes**: Direct handoff patterns that ship the working context as-is

(A handoff must be distilled to a self-contained portable form before it transfers; author-shared context that the recipient cannot resolve is normalized, routed, or surfaced first)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 3, present surfaced residuals, unknown-provenance items, and disposition conflicts for user judgment via Cognitive Partnership Move (Constitution).
</system-reminder>

- Diylisis completes before the handoff transfers to a fresh recipient
- Loaded instructions resume after the PortableHandoff is emitted or Esc

### Trigger Signals

Heuristic signals for session-tethered residue detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Undefined jargon or metric token | A term carries meaning only in the author session (a versioned label, a metric shorthand, a coined name) |
| Deictic anchor | "As above", "the earlier one", "that file", "this approach" — references resolved by session position, not by stable reference |
| Author process narration | Instructions that describe the author's own session workflow rather than the recipient's task |
| Dangling task identifier | A task id referenced without the data a fresh session needs to restore it |
| Fresh-recipient handoff imminent | A handoff brief, subagent dispatch, or resumable plan is being prepared for a session with no shared context |

**Skip**:
- The working context is already self-contained — every load-bearing reference resolves by stable reference
- The recipient shares the author session (same continuous context), so no portability gap exists
- User explicitly says the residue is acceptable for the intended recipient
- Phase 0 detection finds no session-tethered residue

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Fixed point reached with every residual surfaced | Emit PortableHandoff across the prose channel and the schema-versioned TaskStateBlock |
| User Esc at the Phase 3 Gate | Return to normal operation; residual untreated, no PortableHandoff emitted |
| Phase 0 detection finds no residue | Deactivate — silently when AI-detected (Layer 2); with a one-line "already portable" acknowledgment when explicitly invoked via `/distill` (Layer 1) |

## Protocol

### Phase 0: Tethered Detection + Contract Declaration

Verify the working context carries session-tethered residue, then declare the handoff contract. Detection is **silent**; contract declaration is the first user-visible step when residue is present.

1. **Detect residue** — scan the working context for session-tethered references: undefined jargon, metric tokens, deictic anchors, author process narration, dangling task identifiers. The scan itself is silent. If none are present, deactivate — silently when the scan was AI-initiated (Layer 2 auto-detection), or with a one-line "already portable" acknowledgment when the user explicitly invoked `/distill` (Layer 1).
2. **Declare F0 HandoffContract** — fix the recipient profile (default "zero-memory fresh agent"), the next task, the allowed sources (stable references the recipient may read), the execution scope, the verification commands, and the stop condition. The contract is the premise every later phase reads: without a declared next task, recipient-relevance (F3a) and minimality (F4) are undefined. When the next task is absent from the working context, elicit it before proceeding.
3. **Read the CorrectionDelta ledger** — locate the append-only correction-delta record for the session and bind it read-only as `Λ.ledger`. When no ledger is present, bind `Λ.ledger = Unknown`; F3b will route provenance questions to the Gate rather than inferring KEEP.

**Scope restriction**: Read-only investigation. Does NOT modify files or call external services.

### Phase 1: Deictic Closure + Grounding Closure

**F1 — Deictic closure (precedes grounding)**: Scan the working context for surface tokens whose meaning is session-local. For each, build a substitution row: `surface_token → canonical_ref → confidence → unresolved?`. A token resolves when a stable reference (path, url, id, command) or inline evidence carries its meaning without the author session. F1 precedes F2 so that each item audited for self-containment already names a stable referent rather than a session-local anchor. Tokens that cannot be resolved are marked `unresolved = true` and appended to the residual ledger (reason: unresolved) with `surfaced = false`.

**F2 — Grounding closure (self-containment audit)**: For each item, classify how its content is carried to the recipient:
- **Inline** — the evidence travels with the handoff (the recipient needs no external lookup).
- **Stable-pointer** — the item names a stable reference the recipient can resolve (a path, a PR id, a command to run).
- **Routed-residual** — the item cannot be made self-contained in this handoff; it is routed with a reason and appended to the residual ledger (`surfaced = false`). Routed-residual items are surfaced at the Gate before convergence — none reaches the recipient silently.

**Scope restriction**: Read-only investigation (Read, Grep, Glob). The read-only deictic scan — token normalization, bare-identifier detection, and "as above"-style anchor detection — runs as an Extension (it proceeds without a gate); the items it cannot resolve become residual-ledger entries for the Gate.

### Phase 2: Recipient-Relevance + Transformation-Provenance + Disposition

**F3a — Recipient-relevance**: For each item, judge whether it serves the declared next task in the contract. Items the next task does not need are disposition candidates for DROP; items it needs proceed to F3b.

**F3b — Transformation-provenance (read-only from the ledger)**: For each item, attest its provenance against the CorrectionDelta ledger by reading its effective (most-recent non-superseded) matching record. The provenance verdict is binary — a CorrectedKeep-or-complement partition. A matching CorrectionDelta with `export_policy = KEEP` and a non-provisional verification status yields **CorrectedKeep**. Every other ledger state — absent (`Λ.ledger = Unknown`), no matching record, a provisional-only match, or a non-KEEP delta — yields **Unknown**: the item appends to the residual ledger (reason: unknown-provenance, `surfaced = false`) and routes to the Gate. F3b never *infers* KEEP from an item's appearance: a CorrectedKeep verdict is reachable only through an explicit matching non-provisional KEEP delta, and any disposition for an Unknown item is reachable only through a user answer at the Gate. Provenance authority is the KEEP hard line only — ROUTE and DROP are determined by F3a relevance or the Gate, not by a provenance verdict.

**F3 — Disposition**: Assign each item a disposition from the three-way coproduct:
- **KEEP(inline)** — the item is retained inline; reachable only when F3b returns CorrectedKeep or the user answers Resolve at the Gate.
- **ROUTE(StableRef)** — the item is carried by a stable reference the recipient resolves; reachable when F3a relevance routes it or when the user answers Route at the Gate.
- **DROP** — the item does not serve the next task and is released; reachable when F3a relevance drops it or when the user answers Drop at the Gate.

Unknown-provenance items and items with conflicting dispositions are not silently resolved; they enter `Λ.gated` and surface at the Phase 3 Gate.

### Phase 3: Compression + Comprehension Gate + Residual Constitution

**F4 — Compression closure (minimal-complete)**: Compress the kept set to the minimal-complete handoff — retain only what cannot be removed without violating the contract or the residual ledger. Minimality here is contract-relative completeness, not aesthetic brevity: an item stays when its removal would leave the recipient unable to execute the declared next task or would drop a surfaced residual.

**F5 — Comprehension gate (zero-memory standard)**: Verify the minimal-complete handoff against a fresh-recipient comprehension standard using a lint checklist or a fresh subagent. The author's own reading is excluded as the verification channel: an author silently shares the missing context and would pass items a fresh recipient cannot resolve, so a self-simulated read is a false pass. The gate asks whether a recipient with no session access can execute the next task from the handoff alone. A **Fail** verdict names the blocking items — those the fresh-recipient standard cannot resolve — and re-enters them into the residual ledger (reason: comprehension-gap, `surfaced = false`); a Fail blocks the fixed point, so the loop runs another pass and no handoff emits until the comprehension verdict is **Pass**.

**Gate (F3 + F5 surfacing, Constitution)**: Present surfaced residuals, unknown-provenance items, and disposition conflicts via Cognitive Partnership Move (Constitution). Constitution presentation yields turn for user response.

**Pre-gate text output** (Context-Question Separation): Present as text output before the gate:
- The substitution table rows that resolved (surface_token → canonical_ref → confidence)
- The per-item disposition trace for items already disposed (KEEP/ROUTE/DROP with provenance basis)
- The residual ledger entries awaiting judgment (unresolved tokens, unknown-provenance items), each marked with its reason

Then present a per-item interaction for the surfaced residuals and unknown-provenance items:

```
How should this surfaced item be handled in the portable handoff?

Options:
1. **Resolve** — supply the canonical reference or inline evidence: [what stable reference or inline content resolves it]
2. **Route** — carry it by a stable reference the recipient resolves: [the path, id, or command]
3. **Drop** — the next task does not need it; release it from the handoff
4. **Defer** — set it aside until a named condition is met: [the re-trigger condition]
```

Every residual reaches `surfaced = true` through this gate. The user's answer maps the item to a disposition; an Unknown-provenance item becomes KEEP only through a Resolve answer here, never by inference.

### Phase 4: Audit/Lint Loop + Channel Emit

**F6 — Bounded audit/lint loop**: Re-audit the handoff against the monotone hygiene measure — unresolved anchors, unmet stop conditions, schema gaps, unsurfaced residual, and leaked DROP content (the discriminating content of any `Λ.dropped` item that survived into a candidate emit channel — contract, prose, TaskStateBlock, or residual ledger). The leak lint is the minimality dual of the F5 comprehension gate: F5 catches what is *missing* for the recipient, the leak lint catches what was *Dropped yet leaked* back into the emit. When it fires (`leaked_drops > 0`), the repair is a targeted excision — remove each leaked DROP'd item's discriminating content from the candidate emit channels, then re-audit; unlike an F5 Fail, nothing re-enters the residual ledger, since the DROP was already decided at the Gate. Each pass weakly decreases the measure. When the measure reaches zero (or stabilizes with all residuals surfaced, leak-free, and no open disposition conflict) and the comprehension verdict is Pass, the loop is at its fixed point. The loop terminates on the measure and the comprehension verdict, not on a felt sense of completeness.

**F7 — Channel separation emit**: Emit the PortableHandoff across two channels:
- **Prose channel** — the human-readable handoff: contract, distilled context, disposition trace, and the recipient-relevant residual ledger (Route-pending pointers). Drop- and Defer-resolved entries are released from the emit — their content and drop/re-trigger reason are retained session-side in `Λ.history`, not reproduced here. The prose channel carries authority.
- **Schema-versioned TaskStateBlock** — the structured channel that rehydrates dangling task identifiers into restorable task state (schema_version, per-task id/subject/description/restore_status/source_ref). The task-state channel reconstructs task records the recipient can restore; it does not override the prose channel's authority. When stored task status reflects session bookkeeping rather than work completion, the restore_status is set to the recipient-restorable value (pending) rather than the stored value.

After emit, trigger `converge` and present the convergence evidence trace.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Few tethered tokens, single next task, residual minimal | Brief substitution table + disposition trace; one audit pass |
| Medium | Several deictic tokens, multiple dangling tasks, some unknown provenance | Structured substitution table + per-item disposition + surfaced residual ledger + TaskStateBlock; one or two passes |
| Heavy | Dense session residue, ledger absent, many dangling tasks across a long session | Full substitution table + disposition trace + residual ledger + multi-pass audit/lint loop + multi-task TaskStateBlock |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Diylisis) only if ∃ item : depends_on_author_session(item) ∧ ¬resolvable_by_stable_ref(item)` | Prevents false activation on already-portable context |
| Contract-first | F0 HandoffContract declared before relevance and minimality are evaluated | Relevance (F3a) and minimality (F4) have a premise rather than an author guess |
| Deixis before grounding | F1 normalization precedes the F2 self-containment audit | Each grounded item names a stable referent, not a session-local anchor |
| Silent-residual ban | Every routed-residual, unresolved token, unknown-provenance item, and comprehension-gap item enters the ResidualLedger and must reach surfaced = true before convergence | No residue reaches the recipient unseen |
| Provenance hard line | CorrectedKeep reachable only via an effective matching non-provisional KEEP CorrectionDelta or a user Resolve at the Gate; ROUTE/DROP via F3a relevance or the Gate | Unknown provenance is surfaced for judgment, never defaulted to KEEP |
| Zero-memory comprehension | F5 verifies against a fresh-recipient standard; a Fail re-enters blocking items as residuals and blocks the fixed point | A failed gate forces another pass; convergence requires a Pass verdict, so author self-simulation cannot pass items a fresh recipient could not resolve |
| Monotone loop | F6 terminates on a weakly decreasing hygiene measure | Termination is measured, not felt |
| Emit-time leak lint (minimality dual) | F6/F7 assert `leaked_drops = ∅`: no DROP'd discriminating content in any emitted channel (contract, prose, TaskStateBlock, residual ledger) | A surfaced-then-Dropped item cannot leak its content back into the handoff; the dual of the F5 completeness gate |
| Channel separation | F7 emits prose (authoritative) + schema-versioned TaskStateBlock (restorable, non-overriding) | Structured task state rehydrates without usurping prose authority |
| Convergence evidence | Substitution table + disposition trace + surfaced residual ledger + TaskStateBlock presented at convergence | Convergence is demonstrated, not asserted |

## Rules

1. **AI-detects, user-judges residual**: AI detects session-tethered residue, normalizes deixis, audits self-containment, and attests provenance; surfaced residuals and disposition conflicts require user judgment via Cognitive Partnership Move (Constitution) at Phase 3. AI detection is implicitly confirmed when the user engages with the surfaced residual.
2. **Recognition over Recall**: Present surfaced residuals and unknown-provenance items as structured options with differential implications via Cognitive Partnership Move (Constitution); Constitution interaction yields turn before proceeding. The Gate binds to `A ∈ {Resolve, Route, Drop, Defer}` (per TYPES).
3. **Portability over Author Familiarity**: A handoff is portable when no load-bearing reference depends on the author session. Resolve, route, or surface every session-tethered reference rather than shipping it as-is on the author's silent familiarity.
4. **Contract is the premise**: F0 declares the recipient, next task, allowed sources, scope, verification, and stop condition before any relevance or minimality judgment. Recipient-relevance (F3a) judges against the declared next task; minimality (F4) is contract-relative completeness. Declare the contract first so these judgments have a premise.
5. **Deixis precedes grounding**: F1 normalizes each session-local token to a canonical reference before F2 audits self-containment, so every grounded item names a stable referent.
6. **Silent-residual ban**: Every routed-residual (F2), every unresolved token (F1), every unknown-provenance item (F3b), and every comprehension-gap item (F5) enters the ResidualLedger with `surfaced = false` and reaches `surfaced = true` through the Gate before convergence. A residue the recipient cannot see is a portability failure surfaced as a hidden dependency.
7. **Provenance hard line**: F3b reads the append-only CorrectionDelta ledger and grants **CorrectedKeep** only on an effective matching non-provisional `KEEP` record. Every other ledger state — absent, no matching record, provisional-only, or a non-KEEP delta — is **Unknown** and routes to the Gate for user judgment. Provenance authority is the KEEP hard line only: a CorrectedKeep verdict requires an explicit matching non-provisional KEEP delta, ROUTE and DROP dispositions come from F3a relevance or the Gate, and an Unknown item reaches any disposition only through a user answer at the Gate.
8. **Minimal-complete, not minimal-aesthetic**: F4 retains exactly what the recipient needs to execute the declared next task. The surfaced residual-ledger trace (the record of what was surfaced and how the Gate resolved it — Resolve/Route retain the item, Drop/Defer release it) is preserved **session-side** (`Λ.residual_ledger` / `Λ.history`), not in the emit: the emitted handoff carries only the recipient-relevant residue, and a Drop/Defer-released entry is excised from it (per Rule 12, enforced by the leak lint). An item stays in the emit when its removal would break the contract or drop a still-recipient-relevant residual (a Route-pending pointer); a Defer-released entry, like a Drop, is excised from the emit (its re-trigger condition kept session-side); brevity for its own sake is not the standard.
9. **Zero-memory comprehension gate**: F5 verifies against a fresh recipient with no session access, using a lint checklist or a fresh subagent. The author's own read is excluded as the verification channel, because an author silently shares the missing context and would pass items a fresh recipient could not resolve. A Fail verdict re-enters its blocking items into the residual ledger (reason: comprehension-gap) and blocks the fixed point: convergence requires a Pass verdict, so a failed comprehension forces another pass rather than emitting a handoff.
10. **Monotone termination**: F6 loops until the hygiene measure (unresolved anchors, unmet stop, schema gaps, unsurfaced residual, leaked DROP content) reaches its fixed point with a Pass comprehension verdict. Termination is the measured fixed point conjoined with a passing zero-memory gate, not a felt sense that the handoff reads complete.
11. **Channel separation**: F7 emits a prose channel (authoritative) and a schema-versioned TaskStateBlock (restorable task state). The task-state channel rehydrates dangling task identifiers into records the recipient can restore; it complements the prose channel and leaves prose as the authority.
12. **Source-chain preservation**: W.items are read-only across the protocol. Substitution, grounding class, provenance verdict, and disposition annotate the working context; they never mutate the originating items. A DROP disposition removes an item from the emitted handoff but preserves it in `Λ.history` with its drop reason. This removal includes the emitted residual-ledger section: a Drop-resolved residual entry contributes no content to `PortableHandoff.residual_ledger` — only its session-side audit (content + reason) is kept in `Λ.history`. The emit-time leak lint (F6/F7) enforces this: any DROP'd discriminating content present in an emitted channel is a `leaked_drops` defect that increments the hygiene measure and blocks the fixed point.
13. **Context-Question Separation**: The substitution table, disposition trace, and residual-ledger entries appear as text output before the Gate; the Gate question contains only the surfaced item identifier and the four disposition options with their differential implications. Embedding context in the question fields is a protocol violation.
14. **Gate integrity** (Safeguard tier): The Gate option set (`A ∈ {Resolve, Route, Drop, Defer}`) is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option with a concrete reference or condition while preserving the TYPES coproduct) is distinct from mutation.
15. **Ledger read-only in v1**: F3b consumes the CorrectionDelta ledger read-only. The mechanism that records correction deltas during a session is a separate concern; this protocol reads the ledger that exists and treats its absence as Unknown provenance rather than as permission to KEEP.
16. **Plain emit discipline**: User-facing emit (Phase 3 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token carries decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
17. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later passes.
18. **Emit-time leak lint (minimality dual)**: Surfacing a DROP at the Gate is not the same as executing it in the emit. Before convergence, F6/F7 assert `leaked_drops = ∅` — no `Λ.dropped` item's discriminating content survives in any emitted channel (contract, prose, TaskStateBlock, or residual ledger). A surviving DROP increments the hygiene measure and blocks the fixed point. This is the minimality dual of the F5 comprehension gate: F5 catches content *missing* for the recipient; the leak lint catches content *Dropped yet leaked* back into the handoff. The emitted residual ledger carries recipient-relevant residue only (Route-pending); Drop- and Defer-resolved entries are released (Defer = released-not-retained), and the full DROP/surfacing audit trace stays session-side in `Λ.history`.
