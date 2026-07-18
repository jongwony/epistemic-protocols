---
name: attend
description: "Compile execution guardrails before autonomous execution. Infers a boundary map from context, partitions risks by velocity, compiles slow/threshold risks into verifiable predicates, and emits coarse goal entries for a downstream completion-predicate enforcer; fast risks are declared out of scope for harness-level gating. Stateless: compile-time only, no execution-time state. Type: (ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution. Alias: Prosoche(προσοχή)."
---

# Prosoche Protocol

Compile execution guardrails before autonomous execution: infer a boundary map from context, partition risks by velocity, compile slow/threshold risks into verifiable conditions, and emit coarse goal entries that a downstream completion-predicate enforcer consumes. Type: `(ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution`.

## Definition

**Prosoche** (προσοχή): A dialogical act of sustained attention to execution risk — from the Stoic practice of self-aware engagement — resolving execution blindness at compile time. Before an autonomous execution interval begins, Prosoche infers the boundary signals the work is subject to, keeps only those whose violation is evaluable when the loop stops (slow/threshold risks), compiles each into a verifiable predicate, and hands the compiled set off as coarse goal entries. The attention is inscribed into the conditions; the protocol holds no state during execution.

```
── FLOW ──
Prosoche(C) →
  Infer(C) → B →
  Normalize(B) → B̂ →                            -- split signals decomposed (Slow part, Fast part)
  Partition(B̂) → (Bₛ, Bₓ) →
    Bₓ ≠ ∅ → OOS(Bₓ)                            -- fast risks declared out of scope (relay)
    Bₛ = ∅ → no_compile → deactivate            -- nothing loop-consumable (relay)
  ∀b∈Bₛ: Compile(b) → κ ∨ ρ → (K, R) →
  Qc(K, R) → Stop → V →
    V = Adjust(d) → recompile(K, R, d) → (K, R) := (K', R') → Qc(K, R)
    V = Confirm   → AcceptResiduals(R) → Emit(K)[TaskCreate] → G →    -- remaining residuals recorded into Λ.accepted, never emitted
  converge(compilation trace) → SituatedExecution

── MORPHISM ──
ExecutionContext
  → infer(boundary_map)              -- advisory boundary signals from session context
  → partition(velocity)              -- split signals decomposed; slow/threshold in scope; fast declared out of scope
  → compile(conditions)              -- each slow/threshold risk → verifiable predicate
  → confirm(condition_set)           -- user judges the compiled guardrails
  → emit(goal_entries)               -- coarse entries for the downstream enforcer; handoff recorded
  → SituatedExecution
requires: user_initiated(C)          -- user declares execution intent via /attend
deficit:  ExecutionBlind             -- activation precondition (Layer 1)
preserves: C                         -- compile-time only; no execution-state mutation
invariant: Attention over Automation

── TYPES ──
C              = ExecutionContext { args: String?, prior: ProtocolOutput?, session: Context }
ProtocolOutput = prior protocol's converged output in current session (e.g., a boundary map from a boundary-definition protocol)
B              = SignalMap = Set(BoundarySignal)     -- the inferred "boundary map" in prose; advisory input, never a precondition
               -- distinct from /bound's BoundaryMap (Map(Domain, BoundaryClassification)): an upstream
               --   BoundaryMap enters Phase 0 as inference evidence — domain classifications cue signal
               --   kinds and evidence — it is never consumed structurally
BoundarySignal = { kind: SignalKind, evidence: String, velocity: Velocity }
SignalKind     ∈ {ScopeConfinement, Budget, CompletionThreshold, Irreversibility} ∪ Emergent(SignalKind)
Velocity       ∈ {Slow, Fast, Split}
               -- Slow (threshold): violation is evaluable when an execution loop stops — a predicate over observable end-state
               -- Fast: requires pre-action interception at tool-call time — out of scope; harness substrate
               -- Split: carries both an end-state-checkable part and a pre-action part; normalized before partition
Normalize      = B → B̂               -- velocity(b) = Split → b decomposes into bₛ (Slow, end-state-checkable part)
                                     --   and bₓ (Fast, pre-action part); Slow/Fast signals pass through unchanged
                                     -- ambiguous velocity → conservatively classified Slow; both readings
                                     --   surfaced in the Qc gate text (fail-visible, never silently classified)
Partition      = B̂ → (Bₛ, Bₓ)        -- Bₛ = {b : velocity(b) = Slow}, Bₓ = {b : velocity(b) = Fast}
Compile        = BoundarySignal → κ ∨ ρ   -- κ when a verifiable predicate exists; ρ otherwise
κ              = CompiledCondition { subject: String, condition: VerifiablePredicate }
               -- subject: coarse framing of the work unit the condition guards (not a procedural step)
VerifiablePredicate = an executable check with a determinate pass/fail outcome
               -- (command exit status, test result, countable threshold, file-state assertion)
               -- natural-language prose is not a predicate: it invites self-evaluation drift and false completion
ρ              = Residual { signal: BoundarySignal, disposition: ResidualDisposition }
ResidualDisposition ∈ {Sharpen, AcceptUncovered}
               -- Sharpen: user supplies direction at Qc → recompile toward κ (an Adjust direction)
               -- AcceptUncovered: Confirm over a remaining residual constitutes acceptance — remains
               --   unguarded during the interval, recorded in the compilation trace, never emitted
K              = Set(CompiledCondition)
R              = Set(Residual)       -- slow signals lacking a verifiable predicate at compile time
AcceptResiduals = R → Set(BoundarySignal)   -- on Confirm, materializes each remaining residual's signal into Λ.accepted, so accepted_uncovered(b) is a recorded fact, not an unwritten inference
V              = Judgment ∈ {Confirm, Adjust(direction)}
Emit           = K → G [Tool: TaskCreate]
G              = goal entries: coarse task entries consumable by a downstream completion-predicate enforcer
Phase          ∈ {0, 1, 2, 3}
SituatedExecution = situated(C) ∨ no_compile  -- situated(C) defined in CONVERGENCE
EarlyExit = user_esc  -- non-convergent early exit: no emission, no handoff recorded; distinct from no_compile (which is a legitimate trivial-completion terminal, not an abort)

── PHASE TRANSITIONS ──
Phase 0: C → Infer(C) → B                                  -- boundary inference (sense; evidence cited per signal)
Phase 1: B → Normalize(B) → B̂ → Partition(B̂) → (Bₛ, Bₓ)    -- split decomposition + velocity partition (sense)
           Bₓ ≠ ∅ → OOS(Bₓ)                                -- out-of-scope declaration, substrate named (extension)
           Bₛ = ∅ → no_compile → deactivate                -- nothing loop-consumable to compile (extension)
Phase 2: ∀b∈Bₛ: Compile(b) → κ ∨ ρ → (K, R) → Qc(K, R) → Stop → V   -- compilation + confirmation [Tool]
           V = Adjust(d) → recompile(K, R, d) → (K, R) := (K', R') → re-present Qc(K, R)   -- Sharpen rides as an Adjust direction
           V = Confirm   → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.signal | ρ ∈ R} → Phase 3   -- Confirm over remaining ρ records accepted_uncovered before Phase 3
Phase 3: Emit(K) → G [TaskCreate] → converge(compilation trace) → deactivate   -- emission + handoff [Tool]

── LOOP ──
Single pass with a bounded adjustment loop at Phase 2:
  Qc(K, R) → Confirm → Phase 3 (terminal; remaining residuals become accepted_uncovered)
  Qc(K, R) → Adjust(direction) → recompile → re-present (Sharpen moves a residual toward κ)
  Esc → deactivate (EarlyExit, not SituatedExecution — no emission, no handoff recorded)
Stateless: Prosoche terminates at emission. No state survives into the execution interval —
no session approvals, no per-action classification, no mid-execution checkpoint.
Convergence evidence: at emission, present the compilation trace — for each b ∈ Bₛ:
(b.kind, b.evidence) → κ.condition, or its accepted-uncovered residual disposition;
for each b ∈ Bₓ: the out-of-scope declaration with its substrate.
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
accepted_uncovered(b) ≡ b ∈ Λ.accepted   -- recorded by AcceptResiduals(R) on Confirm (Phase 2), not inferred
situated(C) = emitted(G) ∧ handoff_recorded
              ∧ (∀b∈Bₛ: (∃κ∈K compiled from b) ∨ accepted_uncovered(b))
              ∧ (∀b∈Bₓ: declared_oos(b))
SituatedExecution = situated(C) ∨ no_compile
-- The guarantee is compile-time: every loop-consumable boundary signal is either compiled into a
-- verifiable condition or accepted as an uncovered residual at the gate — visibly, in the trace;
-- every fast risk is visibly delegated.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Infer        (sense)        → Internal analysis (boundary heuristics over session context; an upstream boundary map is read when present)
Phase 0 evidence     (observe)      → Read, Grep (optional evidence gathering for boundary signals)
Phase 1 Normalize    (sense)        → Internal analysis (split-signal decomposition into Slow/Fast parts)
Phase 1 Partition    (sense)        → Internal analysis (velocity classification per signal)
Phase 1 OOS          (extension)    → TextPresent+Proceed (fast-risk out-of-scope declaration with substrate handoff note)
Phase 1 no_compile   (extension)    → TextPresent+Proceed (Bₛ = ∅: nothing to compile; deactivate)
Phase 2 Qc           (constitution) → present (compiled condition set + residual disposition confirmation: Confirm / Adjust) [Tool]
Phase 2 AcceptResiduals (track)     → Internal state update (on Confirm: record each remaining residual's signal into Λ.accepted, materializing accepted_uncovered(b) for the convergence predicate)
Phase 3 Emit         (track)        → TaskCreate (coarse goal entries: subject + condition; TodoWrite is the harness-equivalent realization) [Tool]
converge             (extension)    → TextPresent+Proceed (compilation trace; handoff recorded; deactivate)
esc                  (extension)    → TextPresent+Proceed (no emission; deactivate as EarlyExit, not SituatedExecution)
seam                 (extension)    → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move — proceed directly to it, citing that settling source; the `/bound → /attend` inbound leg of the `## Composition` chain relays under this entry; the `/attend → enforcer` outbound leg is EXCLUDED — Rule 6 (Separate activation) governs it more specifically, keeping the enforcer's start the user's own constitutive act; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, boundary: Option(B), slow: Option(Set(BoundarySignal)), oos: Option(Set(BoundarySignal)),
       compiled: Option(K), residuals: Option(R), accepted: Set(BoundarySignal), active: Bool, cause_tag: String }
-- accepted: written by AcceptResiduals(R) on Confirm (Phase 2); accepted_uncovered(b) ≡ b ∈ Λ.accepted (CONVERGENCE)
-- Compile-time only: Λ exists from invocation to emission; nothing persists into the execution interval.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Attention over Automation**: Execution risk gets attention before autonomy begins, not interruptions while it runs. Prosoche inscribes the user's execution intent into verifiable conditions at compile time — every loop-consumable boundary signal becomes a predicate the downstream enforcer can check, and every risk it cannot compile is surfaced with its proper substrate rather than silently dropped. Autonomy is preserved by handing the interval a complete guardrail set, not by supervising it.

Priority ordering: autonomy > transparency > noise-minimization > speed > simplicity.

## Substrate Boundary

Prosoche operates within the epistemic substrate — its protocol scope covers boundary inference, velocity partition, condition compilation, and the compile-time confirmation gate. The Phase 2 gate transmits user judgment into the compiled condition set.

Everything past emission belongs to non-epistemic substrates. Enforcement of the compiled conditions inside the execution interval is the downstream completion-predicate enforcer's contract; pre-action interception of fast risks (destructive command blocking, permission prompts, prompt-injection defense) is the harness permission system's contract; step-by-step approval, resumable state, and timeout/escalation belong to a workflow/HITL substrate. Prosoche classifies and surfaces these boundary crossings, records the handoff, and stops — it neither discharges nor enforces external substrate semantics.

## Mode Activation

### Activation

User calls `/attend` to declare execution intent for an upcoming autonomous execution interval. Prosoche infers the boundary map, compiles the slow/threshold portion into verifiable conditions, confirms the set with the user, and emits it.

**Execution blind** = an autonomous execution interval is about to begin without its boundary conditions inscribed as verifiable predicates — the loop would decide for itself what "done" and "in bounds" mean.

Gate predicate:
```
blind(C) ≡ ∃ b ∈ Normalize(B) : velocity(b) = Slow ∧ ¬compiled(b)
-- evaluated over the normalized map: a Split-only context still yields a Slow part that must compile
```

**Activation layer**:
- **Layer 1 (User-invocable)**: `/attend` slash command or description-matching input. Always available.
- **Layer 2**: Not applicable (user-initiated — no AI-guided activation heuristics).

### Priority

<system-reminder>
When Prosoche is active:

**Supersedes**: Default execution patterns that enter an autonomous interval without compiled boundary conditions

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present the compiled condition set with per-signal evidence via Cognitive Partnership Move (Constitution).
</system-reminder>

- Prosoche completes (emits the condition set) before the execution interval begins
- Loaded instructions and other protocol behaviors are retained
- Prosoche compiles guardrails; it does not drive the execution that follows

### Cross-Session Enrichment

Repeated risk patterns accumulated in Anamnesis's hypomnesis store (prior-session recall indices), and any context surfaced when `/recollect` has been invoked this session, enrich Phase 0 boundary inference — past incidents and recurring failure modes specific to this user and codebase bias which signals are inferred. This is a heuristic input; constitutive judgment remains with the user at Phase 2.

**Revision threshold**: When Emergent boundary signals across 3+ sessions cluster around a recognizable pattern outside the named kinds, the Boundary Signal Taxonomy warrants a new named kind. Named kinds are working hypotheses, not exhaustive categories.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key | Deactivate Prosoche for remainder of session (no emission) |
| `Bₛ = ∅` after partition | No-compile relay: nothing loop-consumable; deactivate with the partition shown |
| Condition set emitted | Terminal: compilation trace presented, handoff recorded, deactivate |

## Boundary Signal Taxonomy

Inference heuristics map context cues to boundary signal kinds. Each inferred signal cites its evidence.

| Kind | Context cues | Velocity | Compiles to |
|------|--------------|----------|-------------|
| **ScopeConfinement** | Permission grants, declared file/repo scope, sandbox limits | Slow | Predicate over touched paths/targets at stop time (e.g., diff confined to declared scope) |
| **Budget** | Token/cost/iteration/time budgets stated or implied | Slow | Countable threshold (iterations ≤ N, elapsed ≤ T) |
| **CompletionThreshold** | Stated done-criteria: tests pass, CI green, citation present, artifact exists | Slow | Executable completion check (exit status, test result, file-state assertion) |
| **Irreversibility** | Reversibility constraints, production targets, deploy/push/delete intent | Split | End-state-checkable part compiles Slow (e.g., no commits beyond branch X); pre-action interception part is Fast → out of scope |
| **Emergent** | Boundary pattern outside named kinds | Assessed per instance | Compiled when a verifiable predicate exists; a slow signal lacking one surfaces as a residual (sharpen or accept as uncovered); a pre-action part is Fast → out of scope with its substrate |

### Risk Velocity Split

- **Slow/threshold risks** are conditions a bounded loop can consume: they are evaluated when the loop stops, as predicates over observable end-state. These compile.
- **Fast risks** require interception *before* an action executes — destructive command blocking, prompt-injection defense, permission escalation. A stop-time predicate structurally cannot catch them: a completion check evaluates after the harm. These are declared out of scope and delegated to the harness permission system or an equivalent pre-action substrate, named in the declaration. Compiling them into stop-time conditions would simulate protection while providing none.

## Protocol

### Phase 0: Boundary Inference

Infer the boundary map from execution context. Scan, in priority order: prior protocol output in this session (a converged boundary map is the richest input), `/attend` arguments, then conversation context.

The boundary map is **advisory input, inferred — never a precondition**. A session that ran a boundary-definition protocol provides explicit signals; a cold session provides heuristic cues (the Context cues column above). Either way Prosoche proceeds: absence of upstream output narrows the inferred map, it does not block compilation.

Present the inferred map as text with per-signal evidence (the cue and where it was observed).

### Phase 1: Velocity Partition

Classify each inferred signal by velocity. A signal carrying both an end-state-checkable part and a pre-action part (e.g., Irreversibility) is first decomposed into those two parts; each part then routes as its own signal:

1. **Slow/threshold** (`Bₛ`): violation evaluable at loop stop time → proceeds to compilation
2. **Fast** (`Bₓ`): requires pre-action interception → declared out of scope as relay text, with the delegated substrate named (harness permission system, pre-action hook, HITL gate)

When `Bₛ = ∅`: present the partition (everything was fast-velocity or no signals were inferred) and deactivate — there is nothing a stop-time predicate can guard, so emitting would manufacture false coverage.

Partition failure mode is fail-visible: a signal whose velocity is ambiguous is conservatively routed to compilation (classified Slow at normalization) and surfaced in the Phase 2 gate text with both readings rather than silently classified.

### Phase 2: Condition Compilation and Confirmation

Compile each slow/threshold signal into a `{ subject, condition }` pair:

- **subject** — a coarse framing of the work unit the condition guards, not a procedural step.
- **condition** — a verifiable predicate: an executable check with a determinate pass/fail outcome. A condition that can only be stated as prose judgment ("the code is clean enough") is not compilable — surface it as a residual for the user to either sharpen into a predicate or accept as uncovered.

Present the compiled set as pre-gate text (per-condition: source signal, evidence, predicate), and each remaining residual with its uncovered-risk note, then **present** via Cognitive Partnership Move (Constitution):

```
Compiled guardrail set ready. How should it land?

Options:
1. **Confirm** — emit these conditions as the goal entries for the execution interval; any remaining residuals are accepted as uncovered (unguarded during the interval, recorded in the trace)
2. **Adjust** — modify, add, or remove conditions: [prompt for direction]
```

Adjust recompiles per the user's direction and re-presents. The loop is bounded by user agency: Confirm or Esc terminates it.

### Phase 3: Emission and Handoff

On Confirm:

1. **Emit** the confirmed set as coarse goal entries via TaskCreate — one entry per `{ subject, condition }`, the condition carried as the entry's verifiable completion criterion
2. **Present the compilation trace**: each slow signal → its compiled condition; each fast signal → its out-of-scope declaration and delegated substrate; each residual → its disposition
3. **Record the handoff** and deactivate

Emission is Prosoche's epistemic endpoint. Prosoche does not invoke the downstream enforcer — the user activates it separately, with the emitted entries as its condition source. Nothing of Prosoche survives into the execution interval.

## Composition

Prosoche is the compile step inside a conducted execution workflow. The composition, in prose with standard notation:

- **Conduct drives**: `/conduct` (Hyphegesis) owns workflow driving — which moves run, in what order, with what checkpoints. Within a conducted method, the execution-preparation chain is `/bound` → `/attend` → enforcer: `/bound` defines the boundary map, `/attend` compiles its slow/threshold portion into verifiable conditions, and the enforcer runs the autonomous loop inside those bounds. Neither `/attend` nor the enforcer drives the workflow — `/attend` is a compiler, the enforcer is a leaf.
- **The enforcer is a leaf executor**: on Claude Code (verified against v2.1.140; bounded claim — re-verify on harness version change), `/goal` installs a session-scoped stop-hook that re-prompts the model until its condition is met. It enforces a completion predicate *inside* one bounded interval; it exposes no external step injection and no mid-loop gating. Driving it as a progressive workflow engine fails structurally — that role belongs to `/conduct` and, for step-approval/resume/timeout semantics, to a workflow/HITL substrate outside this protocol suite.
- **Guard role**: the compiled conditions defend the enforcer's two characteristic failure modes — (a) early or false termination below the boundary conditions (CompletionThreshold and Budget predicates make "done" determinate), and (b) boundary erosion across a long interval, as repetitive scripts or unstructured data drift work outside the user's declared bounds (ScopeConfinement and slow-Irreversibility predicates make the erosion detectable at stop time).
- **Separate activation**: emitting the compiled entries is `/attend`'s epistemic endpoint. The user invokes the enforcer separately — automatic coupling to a harness built-in is avoided by design, so the constitutive act of starting the autonomous interval stays with the user.
- **After the interval**: `/contextualize` checks post-execution applicability and `/grasp` verifies understanding of the result, both downstream of the enforced run.

## Known Limitations

**Bounded platform claim**: The leaf-executor characterization of `/goal` (stop-hook predicate enforcer, no external step injection) is verified against Claude Code v2.1.140 only. A harness version change requires re-verification before relying on the composition guidance above.

**Inference is heuristic**: Boundary inference pattern-matches context cues; a boundary the user holds but never uttered, and that no upstream protocol captured, will not be inferred. The Phase 2 gate is the correction point — the compiled set is presented precisely so missing conditions become visible.

**Predicate coverage**: Subjective quality bars and moving targets do not compile into verifiable predicates. Prosoche surfaces them as residuals rather than emitting prose conditions; an uncovered residual the user accepts remains genuinely unguarded during the interval.

**No execution-time protection**: Prosoche is compile-time only. A risk that emerges mid-interval — one not present in the boundary map at compile time — is outside the emitted condition set; fast risks are entirely the pre-action substrate's responsibility.

## Rules

1. **User-initiated, AI-compiled**: User declares execution intent via `/attend`; AI infers the boundary map, partitions by velocity, and compiles conditions; the user judges the compiled set via Cognitive Partnership Move (Constitution) at Phase 2.
2. **Verifiable predicate required**: Every emitted condition is an executable check with a determinate pass/fail outcome. A condition expressible only as prose judgment is surfaced as a residual — sharpened into a predicate or accepted as uncovered — and is never emitted as prose.
3. **Slow/threshold only**: Only conditions evaluable at loop stop time compile. Fast risks are declared out of scope with their delegated substrate named; compiling them into stop-time conditions simulates protection while providing none.
4. **Advisory boundary input**: An upstream boundary map enriches Phase 0 inference but is never a precondition; absence of upstream output narrows the inferred map without blocking compilation.
5. **Stateless compile**: Emission is terminal. No session approvals, no per-action classification, no mid-execution checkpoint; re-invocation recompiles from current context rather than resuming prior state.
6. **Separate activation**: Emitting goal entries is the epistemic endpoint. Prosoche does not invoke the downstream enforcer; starting the autonomous interval is the user's separate constitutive act.
7. **Coarse emission**: Goal entries carry work-unit framings, not procedural step decompositions — the enforcer owns the interval's internal steps.
8. **Transparency-grounded**: Every inferred signal cites its evidence; every partition decision, residual, and out-of-scope delegation is visible in pre-gate text or the compilation trace — surfaced and silent paths satisfy the same transparency invariant.
9. **Recognition over Recall**: Present structured options with differential implications via Cognitive Partnership Move (Constitution); Constitution interactions yield turn before proceeding.
10. **Context-Question Separation**: All analysis, evidence, and rationale appear as text output preceding the Constitution interaction; the question contains only the essential choice and option-specific differential implications.
11. **Convergence evidence**: Present the compilation trace before deactivating — per-signal evidence (`signal → compiled condition`, `signal → accepted-uncovered residual`, or `signal → out-of-scope substrate`) is required, not asserted.
12. **Option-set relay test (Extension classification)**: When AI analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension. Each Constitution option must be genuinely viable under different user value weightings; options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
13. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct structure) is distinct from mutation.
14. **Substrate boundary**: Prosoche scope is the epistemic substrate — boundary inference, velocity partition, condition compilation, compile-time confirmation. Enforcement inside the interval, pre-action interception, and workflow/HITL semantics belong to native harnesses or specialized substrates, delegated by handoff at emission.
15. **Plain emit discipline**: User-facing emit (inferred-map prose, gate options, compilation traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the boundary, the condition, or the question in their idiom.
16. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background and distant context to pre-gate text or the compilation trace.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
18. **Seam relay on declared continuation, enforcer edge excepted**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after this protocol's emission is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). The inbound `/bound → /attend` leg of the `## Composition` chain relays under this rule — settled by this protocol's own `## Composition` edge (the declared `/bound → /attend → enforcer` chain) or a user chain declaration into `/attend`, not by `/bound`'s seam entry, which declares no outbound continuation edge. The outbound `/attend → enforcer` leg is EXCLUDED: Rule 6 (Separate activation) governs it more specifically — starting the autonomous interval is the user's separate constitutive act, deliberately kept outside automatic coupling, and this seam-relay rule never elides that act. This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
