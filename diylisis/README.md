# Diylisis (διύλισις) — /distill

> [한국어](./README_ko.md)

Certify an existing substrate-owned record's portability for a declared recipient role — a Task description, a commit message, a delegation prompt, a durable document — repairing what can be repaired in place and surfacing what cannot. Diylisis points at the record; it never authors a new one.

## Type Signature

```
(ContextTethered, AI, DISTILL, StableRef) → Certificate
```

## What It Does

A substrate-owned record accumulates session-tethered residue — undefined jargon, metric shorthand, author process traces, tool state, and dangling task identifiers — that reads as complete to its author because the author silently shares the missing context. A fresh recipient with no session access has none of that shared ground. Diylisis certifies the record's portability in place: each deictic token is normalized to a canonical reference, each item is audited for self-containment, each judgment is graded against the declared recipient role and its transformation-provenance, and unresolved residue is surfaced rather than silently carried.

The morphism runs F0 through F7 once forward, then re-audits against a hygiene measure until it reaches a fixed point. The measure is NOT monotone — a repair pass authors new prose that can itself raise the measure before it settles — so termination is argued from the fixed point's structure (dispositions are permanent, the Gate bottoms out on a Resolve), not from a per-pass decrease:

- **F0 — Certification contract**: declare `target` (the existing record under certification), the recipient's **boundary** (an open, user-declared Role — no protocol-owned enum), an optional **activity**, allowed sources, scope, verification, and stop condition. The premise for relevance and minimality.
- **F1 — Deictic closure + decision binding**: normalize each session-local token within `target` to a canonical reference; bind each decision-shaped item to a `DecisionRecord{claim, ledger_ref}` naming the durable record where its rationale lives (this project: the git record — commit messages, issue/PR bodies).
- **F2 — Grounding closure**: audit each item for self-containment — inline, stable-pointer, or routed-residual. A stable-pointer's locator must resolve without the author session and remain dereferenceable and re-verifiable when the receiver checks it at consume time.
- **F3a — Recipient-relevance**: judge each item against the declared activity and boundary.
- **F3b — Transformation-provenance**: a two-way verdict — **ObservedKeep** (a durable, directly-observable source coupled to the value by support-integrity — KEPT directly, no Gate) or **Unknown** (no observable basis → Gate).
- **F3 — Disposition**: KEEP(inline) | ROUTE(StableRef) | DROP. A DROP with excisable target content surfaces at the Gate, and the user's Drop answer confirms its excision delta: the dropped item's discriminating content is removed from `target` in place (claim-preserving), so the fresh recipient inherits kept and routed content only — the dropped content and its reason survive session-side.
- **F4 — Judgment formation**: construct the certificate's `RouteJudgment` list — each kept or routed item paired with its verdict (`Value(inline_evidence)` or `Reference(stable_ref)`) and a cited `basis`.
- **F5 — Comprehension gate (always on)**: verify against a zero-memory recipient via the refute-posture `zero-memory-refuter` subagent, dispatched every certification pass — no optional layer. Attacks each judgment's basis and the reception procedure's sufficiency; author self-simulation is excluded.
- **F6 — Bounded audit/lint loop**: terminate on the hygiene measure's fixed point (including missing judgment bases, unresolvable route pointers, and ledger-less decisions — mechanical, no-dispatch legs) plus a Pass comprehension verdict — not on a per-pass decrease and not a felt sense of completeness.
- **F7 — Certify**: assemble the **Certificate** — the certified record's own reference and activation edge (self-identifying when externalized), the judgment list, an outcome (`AlreadyPortable` when nothing needed repair, `Repaired(deltas)` otherwise), and the mandatory **reception procedure** (role declaration, receiver-run dereference steps, and the premise list of claim-repair findings the receiver reconfirms). `target` already carries every repair delta — resolution additions and drop-excisions, applied in place at the pass that classified each, none altering an asserted claim — so F7 edits nothing further: it certifies the same state the final Pass verdict reviewed.

**Core principle**: Portability over Author Familiarity — a record is portable when the author's familiarity is no longer a hidden dependency, and the Certificate names the basis for every judgment even when nothing needed fixing.

## When It Activates

- User calls `/distill`, naming a target record and a recipient role (Layer 1, always available)
- AI detects session-tethered residue in a record about to cross a reception boundary — a Task about to be handed to a fresh subagent, a doc about to be shared, a delegation prompt about to be dispatched (Layer 2, silent detection)

`/distill` assumes a **secret-free record** — stripping secrets (credentials, tokens, keys) is a separate concern handled upstream by a dedicated redaction agent, not part of the distill morphism.

## Disposition Coproduct

Each item resolves into one of three named dispositions. Surfaced residuals and unknown-provenance items are presented at the Gate so each judgment is recognizable, not recalled.

| Disposition | Meaning |
|-------------|---------|
| **KEEP(inline)** | Item retained inline. Reachable via ObservedKeep (a durable observable source with support-integrity, KEPT directly) or a user Resolve answer. |
| **ROUTE(StableRef)** | Item carried by a stable reference the recipient resolves (path, id, url, command). |
| **DROP** | Item does not serve the declared activity; released from the certification. |

At the Gate, a surfaced residual or unknown-provenance item is answered with `Resolve | Route | Drop | Defer`.

## The Provenance Hard Line

F3b never infers KEEP from how settled an item *looks*. KEEP is reachable exactly two ways: **ObservedKeep** — a durable, directly-observable source (a file read, a command's output, a PR/issue URL, a durable stable-ref) coupled to the kept value by support-integrity, KEPT directly without a Gate — or a user **Resolve** at the Gate. An item with no observable basis is **Unknown** — surfaced at the Gate for user judgment, never defaulted to KEEP. ObservedKeep is relay against an external, recipient-re-observable basis — not an author's unverified belief — so support-integrity (not mere currency) is the bar, and an uncertain or contested basis is conservatively Unknown. A correction-requiring claim — one that diverges from its observable source — cannot be ObservedKeep; it surfaces at the Gate for a user Resolve. Decision-shaped content instead carries a `DecisionRecord` pointing at the durable record (this repo: git) where its rationale lives, rather than resolving through this KEEP test.

## Assurance Tiers

The label is **record-relative**: it attaches to `target` — the certified record Diylisis points at — never to a new content record (the one artifact Diylisis produces is the Certificate itself — the judgment layer over `target`, landing at `certificate_target` or the session scratchpad, never inside `target`).

| Tier | Label | What it runs |
|------|-------|--------------|
| Draft | **Uncertified draft** | No Diylisis pass has run against `target` — plain Markdown, no F5 gate, no leak / durable-pointer audit. No Certificate has been issued against `target`. |
| Certified | **Certified `/distill`** | One always-on F5 comprehension-gate Pass (realization recorded in the verdict) + one leak / durable-pointer audit, reaching fixed point. A Certificate has been issued against `target`: the F5 gate reached Pass under the realization its verdict records (refuter subagent, generic subagent, or lint fallback — the label claims exactly that realization's rigor), every judgment basis is grounded, and the audit cleared. |

Because the F5 dispatch is unconditional — every certification pass runs the full gate under the strongest realization the platform offers, no optional lighter layer — there is no partial-rigor middle tier: `target` either has never been through F7 (Draft) or has a completed pass's Certificate issued against it (Certified). The label certifies `target` together with its emitted activation edge; a later edit outside Diylisis, or a certification dispatched under a substituted edge, breaks the verified reception conditions.

## Known Limitations

- **Reception-procedure re-verification is receiver-owned**: the emitted dereference steps are what the receiver runs with its own tools; Diylisis does not itself confirm the receiver actually re-ran them.
- **First wired surface**: plan-level certification is the first wired surface for `/distill`; session-mid pruning and subagent handoff accrue as later surfaces.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install diylisis@epistemic-protocols
```

## Usage

```
/distill [target record] [recipient role]   # Certify an existing record's portability for a declared recipient
```

## License

MIT
