# Diylisis (διύλισις) — /distill

> [한국어](./README_ko.md)

Distill a session-tethered working context into a self-contained portable handoff a fresh zero-memory agent can execute from. Normalizes deixis, audits self-containment, judges relevance and provenance, then emits a prose channel plus a schema-versioned task-state block.

## Type Signature

```
(ContextTethered, AI, DISTILL, WorkingContext) → PortableHandoff
```

## What It Does

A working session's context window inevitably accumulates session-tethered residue — undefined jargon, metric shorthand, author process narration, tool state, and dangling task identifiers — that reads as complete to the author because the author silently shares the missing context. A fresh recipient with no session access has none of that shared ground. Diylisis distills the working context into a handoff whose every load-bearing reference resolves without the author session.

The morphism runs F0 through F7 once forward, then re-audits against a monotone hygiene measure until it reaches a fixed point:

- **F0 — Handoff contract**: declare recipient, next task, allowed sources, scope, verification, stop condition, and **handoff durability** (`OneShot` | `ExternalVersioned` | `DurableRepo`). The premise for relevance and minimality; durability conditionalizes the correction ledger.
- **F1 — Deictic closure**: normalize each session-local token to a canonical reference. Runs before grounding so each grounded item names a stable referent. Emits `surface_token → canonical_ref → confidence → unresolved?`.
- **F2 — Grounding closure**: audit each item for self-containment — inline, stable-pointer, or routed-residual. No residual is dropped silently.
- **F3a — Recipient-relevance**: judge each item against the declared next task.
- **F3b — Transformation-provenance**: a ternary verdict — **CorrectedKeep** (a matching non-provisional unexpired `KEEP` `CorrectionDelta`, DurableRepo only), **ObservedKeep** (no correction record and a durable, directly-observable source coupled to the value by support-integrity — KEPT directly, no ledger, no Gate), or **Unknown** (no observable basis and no delta → Gate). Ordinary source-backed state is ObservedKeep, so an absent ledger no longer routes every item to the Gate; KEEP is never inferred from appearance, and a correction-requiring claim still needs the ledger or a Gate Resolve.
- **F3 — Disposition**: KEEP(inline) | ROUTE(StableRef) | DROP.
- **F4 — Compression closure**: retain the minimal-complete set — contract-relative completeness, not aesthetic brevity.
- **F5 — Comprehension gate**: verify against a zero-memory recipient via the refute-posture `zero-memory-refuter` subagent (fresh context, session-term watchlist, evidence-cited verdict; platform ladder: named agent → generic fresh subagent → lint checklist, the lint tier weakened — no fresh-context isolation); author self-simulation is excluded. Includes the **prose-only deletion test**: with the TaskStateBlock, the correction ledger, native task-state, and every agent-specific affordance ignored, the next task must still execute from the prose channel plus the allowed sources alone — otherwise the gate Fails.
- **F6 — Bounded audit/lint loop**: terminate on a weakly decreasing hygiene measure, not a felt sense of completeness.
- **F7 — Channel separation**: emit a prose channel (authoritative) plus a schema-versioned `TaskStateBlock` that rehydrates dangling task identifiers.

**Core principle**: Portability over Author Familiarity — a handoff is portable when the author's familiarity is no longer a hidden dependency.

## When It Activates

- User calls `/distill` (Layer 1, always available)
- AI detects session-tethered residue before a context handoff — a handoff brief, a fresh-context subagent dispatch, a resumable plan (Layer 2, silent detection)

`/distill` assumes a **secret-free working context** — stripping secrets (credentials, tokens, keys) is a separate concern handled upstream by a dedicated redaction agent, not part of the distill morphism.

## Disposition Coproduct

Each item resolves into one of three named dispositions. Surfaced residuals and unknown-provenance items are presented at the Gate so each judgment is recognizable, not recalled.

| Disposition | Meaning |
|-------------|---------|
| **KEEP(inline)** | Item retained inline. Reachable via CorrectedKeep (a matching non-provisional `CorrectionDelta`, DurableRepo), ObservedKeep (a durable observable source with support-integrity, KEPT directly), or a user Resolve answer. |
| **ROUTE(StableRef)** | Item carried by a stable reference the recipient resolves (path, id, url, command). |
| **DROP** | Item does not serve the declared next task; released from the handoff. |

At the Gate, a surfaced residual or unknown-provenance item is answered with `Resolve | Route | Drop | Defer`.

## The Provenance Hard Line

F3b never infers KEEP from how settled an item *looks*. KEEP is reachable exactly three ways: **CorrectedKeep** — a matching `CorrectionDelta` with `export_policy = KEEP`, a non-provisional status, and an unlapsed `validity_horizon` (DurableRepo only; the ledger's authority, reserved for corrected, disputed, stale, or user-constituted claims); **ObservedKeep** — no correction record and a durable, directly-observable source (a file read, a command's output, a PR/issue URL, a durable stable-ref) coupled to the kept value by support-integrity, KEPT directly without a ledger or the Gate; or a user **Resolve** at the Gate. An item with no observable basis and no delta is **Unknown** — surfaced at the Gate for user judgment, never defaulted to KEEP. ObservedKeep is relay against an external, recipient-re-observable basis — not an author's unverified belief — so support-integrity (not mere currency) is the bar, and an uncertain or contested basis is conservatively Unknown. The hard line that a **correction-requiring claim still needs the ledger** holds: a claim diverging from its observable source cannot be ObservedKeep. See [`references/correction-delta-schema.md`](./skills/distill/references/correction-delta-schema.md) for the ledger schema and read contract.

The correction ledger is **conditional on handoff durability**: maintained only for `DurableRepo` (durable, re-distilled in-repo handoffs — the only mode where CorrectedKeep is reachable). `OneShot` (temporary, used once) keeps none; `ExternalVersioned` (Notion, Linear, any externally-versioned store) defers to the external system's native history and records its version handle as the provenance pointer. This pairs with ObservedKeep to collapse the common-case gate storm for everyday temporary and external-target handoffs.

## Assurance Tiers

The artifact's label honestly reflects the rigor actually applied — a lower tier never borrows a higher tier's claim:

| Tier | Label | What it runs |
|------|-------|--------------|
| (a) | **Quick handoff draft** | Plain Markdown only — no F5 gate, no audit, no ledger. Makes **no** PortableHandoff claim. |
| (b) | **Certified light /distill** | One F5 pass (incl. the prose-only deletion test) + one leak / durable-pointer audit; no CorrectionDelta ledger (that is the DurableRepo / tier-(c) path) — a correction surfaces at the Gate. |
| (c) | **Heavy /distill** | Full refuter + watchlist + residual Gate + `CorrectionDelta` ledger + leak lint + convergence evidence + re-distillation (the DurableRepo path). |

**Honest-label rule**: the formal `converge` transition fires at any tier that reaches a fixed point with a Pass verdict — tier (b) included, so a certified-light handoff formally converges and emits a legitimate `PortableHandoff`. The assurance **label** "converged /distill" is narrower: it is reserved for the tier-(c) full-assurance fixed point with a Pass verdict. A skipped-refuter artifact (tier (a)) is a **draft / degraded handoff** — never a `PortableHandoff`, never "converged /distill". Tier (b) is the floor for the PortableHandoff claim.

## Known Limitations

- **Ledger writes scoped to re-distillation**: F3b consumes the `CorrectionDelta` ledger read-only; the F7 re-distillation emit appends to it (Rule 19). The mechanism that records correction deltas mid-session is a separate, deferred concern.
- **First wired surface**: plan-level handoff is the first wired surface for `/distill`; session-mid pruning and subagent handoff accrue as later surfaces.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diylisis@epistemic-protocols
```

## Usage

```
/distill [optional next-task or recipient]   # Distill a working context into a portable handoff
```

## License

MIT
