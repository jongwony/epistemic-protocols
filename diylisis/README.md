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

- **F0 — Handoff contract**: declare recipient, next task, allowed sources, scope, verification, stop condition. The premise for relevance and minimality.
- **F1 — Deictic closure**: normalize each session-local token to a canonical reference. Runs before grounding so each grounded item names a stable referent. Emits `surface_token → canonical_ref → confidence → unresolved?`.
- **F2 — Grounding closure**: audit each item for self-containment — inline, stable-pointer, or routed-residual. No residual is dropped silently.
- **F3a — Recipient-relevance**: judge each item against the declared next task.
- **F3b — Transformation-provenance**: attest each item against an append-only `CorrectionDelta` ledger. KEEP is granted only on a matching non-provisional correction; an absent ledger yields Unknown, which routes to the Gate — KEEP is never inferred.
- **F3 — Disposition**: KEEP(inline) | ROUTE(StableRef) | DROP.
- **F4 — Compression closure**: retain the minimal-complete set — contract-relative completeness, not aesthetic brevity.
- **F5 — Comprehension gate**: verify against a zero-memory recipient via lint checklist or fresh subagent; author self-simulation is excluded.
- **F6 — Bounded audit/lint loop**: terminate on a weakly decreasing hygiene measure, not a felt sense of completeness.
- **F7 — Channel separation**: emit a prose channel (authoritative) plus a schema-versioned `TaskStateBlock` that rehydrates dangling task identifiers.

**Core principle**: Portability over Author Familiarity — a handoff is portable when the author's familiarity is no longer a hidden dependency.

## When It Activates

- User calls `/distill` (Layer 1, always available)
- AI detects session-tethered residue before a context handoff — a handoff brief, a fresh-context subagent dispatch, a resumable plan (Layer 2, silent detection)

## Disposition Coproduct

Each item resolves into one of three named dispositions. Surfaced residuals and unknown-provenance items are presented at the Gate so each judgment is recognizable, not recalled.

| Disposition | Meaning |
|-------------|---------|
| **KEEP(inline)** | Item retained inline. Reachable only via a matching non-provisional `CorrectionDelta` or a user Resolve answer. |
| **ROUTE(StableRef)** | Item carried by a stable reference the recipient resolves (path, id, url, command). |
| **DROP** | Item does not serve the declared next task; released from the handoff. |

At the Gate, a surfaced residual or unknown-provenance item is answered with `Resolve | Route | Drop | Defer`.

## The Provenance Hard Line

F3b reads the `CorrectionDelta` ledger read-only. An item is corrected-in-session only when a matching record carries `export_policy = KEEP` with a non-provisional status. When the ledger is absent or carries no matching record, provenance is **Unknown** — the item is surfaced at the Gate for user judgment rather than defaulted to KEEP. This keeps a fresh recipient from inheriting an author's unverified belief as settled fact. See [`references/correction-delta-schema.md`](./skills/distill/references/correction-delta-schema.md) for the ledger schema and read contract.

## Known Limitations

- **Ledger read-only in v1**: F3b consumes the `CorrectionDelta` ledger; the mechanism that records correction deltas during a session is a separate, deferred concern.
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
