# CorrectionDelta Ledger Schema and F3b Read Contract

This reference defines the append-only `CorrectionDelta` ledger that the F3b transformation-provenance phase reads, and the contract by which F3b decides whether an item is corrected-in-session. F3b consumes the ledger read-only; the F7 re-distillation emit appends to it (Rule 19).

## Storage format

The ledger is a JSON Lines (JSONL) file: one `CorrectionDelta` object per line, append-only, in correction order. A conventional location is a per-session file such as `~/.claude/.write/correction-delta-<session>.jsonl`. When no ledger file exists for the session, F3b treats provenance as `Unknown` and routes the item to the Gate.

Append-only means a correction is never edited in place. A later correction that revises an earlier one references the earlier record's `id` in its `supersedes` array; the earlier record stays on disk.

## Field schema

Each line is one object with these fields:

| Field | Type | Meaning |
|-------|------|---------|
| `id` | string | Unique identifier for this correction record |
| `subject_ref` | StableRef | The item being corrected, named by a reference resolvable without the author session |
| `claim_kind` | string | The semantic category of the corrected claim (protocol-local, self-contained) |
| `original_ref` | StableRef \| null | Reference to the pre-correction claim, when one exists |
| `original_claim_hash` | string \| null | Hash of the pre-correction claim text, for tamper-evidence |
| `corrected_claim` | string | The corrected claim text |
| `correction_basis_ref` | StableRef \| InlineEvidence | The evidence that grounds the correction |
| `corrected_at` | timestamp | When the correction was recorded (ISO 8601 UTC, `Z`-suffixed) |
| `corrected_by` | "User" \| "Tool" \| "AI" | Who recorded the correction |
| `supersedes` | string[] | `id`s of earlier records this correction revises |
| `validity_horizon` | duration \| null | How long the correction's unattended KEEP standing holds (ISO 8601 duration, P-notation — e.g. `P7D`). Expiry routes the item to the Gate for re-verification (reason: `horizon-expired`); it never removes or suppresses the delta |
| `horizon_basis_ref` | StableRef \| InlineEvidence \| null | Required when `validity_horizon` is set: the user-constituted content the horizon was transcribed from (Rule 20). Null on legacy records |
| `export_policy` | "KEEP" \| "ROUTE" \| "DROP" | The disposition this correction carries into a handoff |
| `verification_status` | "observed" \| "user_confirmed" \| "tool_confirmed" \| "provisional" | The confidence channel that settled the correction |

`StableRef` is `{ kind: "path" | "url" | "id" | "command", locator: string }`. `InlineEvidence` is `{ content: string }`.

**Temporal encoding.** `corrected_at` is an ISO 8601 UTC timestamp (`Z`-suffixed); `validity_horizon` is an ISO 8601 duration in P-notation (e.g. `P7D` for seven days); the expiry sum `corrected_at + validity_horizon` is evaluated in UTC.

## F3b read contract

F3b reads the ledger and applies one predicate per context item:

```
effective_delta(item) ≡
  the most-recent non-superseded d ∈ ledger with d.subject_ref = ref(item)
  (∅ when the ledger is absent or carries no matching record)

expired(d) ≡
  d.validity_horizon ≠ null ∧ now > d.corrected_at + d.validity_horizon
  (now is the invocation constant, bound once into the protocol mode state at the Phase 0 ledger bind; the sum is evaluated in UTC)

corrected_in_session(item) ≡
  effective_delta(item) = d
    ∧ d.export_policy = "KEEP"
    ∧ d.verification_status ≠ "provisional"
    ∧ ¬expired(d)
```

The verdict is binary — a CorrectedKeep-or-complement partition:

- **CorrectedKeep** — the predicate holds: a matching record carries `export_policy = KEEP` with a non-provisional status and an unlapsed `validity_horizon` (`¬expired(d)`). The item is eligible for the KEEP disposition.
- **Unknown** — every other ledger state: the ledger is absent, no record matches `subject_ref = ref(item)`, the only matching record is `provisional`, the matching record carries a non-KEEP `export_policy` (ROUTE or DROP), or the matching KEEP record is expired (reason recorded as `horizon-expired`, presented at the Gate as re-verification, not as undecided provenance). The item's provenance is undecided: it appends to the residual ledger with reason `unknown-provenance` (`horizon-expired` for the expired case) and routes to the Gate for user judgment. A ROUTE or DROP correction records the author's intent, but F3b grants no disposition from it — provenance authority is the KEEP hard line only; ROUTE and DROP dispositions are reached through F3a relevance or the Gate.

## The hard line

F3b never infers KEEP from how settled an item looks. KEEP is reachable only two ways: a matching non-provisional `CorrectionDelta` with `export_policy = KEEP`, or a user `Resolve` answer at the Gate. Absence of evidence is `Unknown`, surfaced for judgment — not silent retention. This keeps a fresh recipient from inheriting an author's unverified belief as a settled fact. An expired KEEP record likewise grants nothing: its unattended authority lapses and the item is surfaced for re-verification — expiry is a question, never a silent retention or a silent deletion.

## Validity horizon

**Writer rule — constituted transcription only.** A `validity_horizon` is set in exactly two legal ways: transcribed from a temporal indexical present in user-constituted content (a user statement, user-supplied evidence), or set directly by the user at the Gate. Model classification of how perishable a claim "looks" is forbidden as a horizon source.

**Basis requirement.** A set horizon carries `horizon_basis_ref` — the stable reference or inline evidence naming the constituted content the horizon was transcribed from. A horizon without a basis is not `ledger_emit_clean`: the F6 `unclean_deltas` measure leg counts it and blocks the fixed point until the delta is rewritten with its basis (or the horizon removed).

**Expiry consequence.** When `now > corrected_at + validity_horizon` (with `now` fixed once per distillation invocation, at the Phase 0 ledger bind), the delta's unattended KEEP authority lapses: F3b yields Unknown and the item surfaces at the Gate as a re-verification question (reason: `horizon-expired`). Expiry never removes, suppresses, or rewrites the delta, and never demotes the item to DROP.

**Legacy null-basis records.** A read delta carrying a `validity_horizon` without `horizon_basis_ref` (legacy/foreign) is still evaluated for expiry — the conservative direction, since expiry only routes to the Gate; the basis requirement binds the write side this protocol emits.

Worked example — a user states "these creds rotate every Friday", so a 7-day horizon is transcribed:

```json
{"id": "cd-0042", "subject_ref": {"kind": "path", "locator": ".env.staging"}, "claim_kind": "credential-value", "original_ref": null, "original_claim_hash": null, "corrected_claim": "Staging DB credentials are the values in .env.staging as of 2026-06-05", "correction_basis_ref": {"content": "User: rotated staging creds this morning"}, "corrected_at": "2026-06-05T10:12:00Z", "corrected_by": "User", "supersedes": [], "validity_horizon": "P7D", "horizon_basis_ref": {"content": "User: these creds rotate every Friday"}, "export_policy": "KEEP", "verification_status": "user_confirmed"}
```

Counterexample: the model judging "credentials feel perishable, assign 7 days" is forbidden — no temporal indexical was constituted.

## Supersession

When a correction is itself later corrected, the newer record lists the older record's `id` in `supersedes`. F3b reads the effective correction as the most recent non-superseded record for a given `subject_ref`. A superseded record does not grant KEEP even if its own `export_policy` was KEEP.

When the superseding record re-confirms a horizon-expired correction (a Gate Resolve under re-distillation), its fields are fixed by SKILL.md Rule 20, not inferred: `supersedes` lists the expired record's `id`; `subject_ref` and `claim_kind` carry over; `corrected_claim` restates the re-confirmed value positively; `correction_basis_ref` names the user's Resolve answer at the Gate; `corrected_at` is the invocation timestamp; `corrected_by` is `"User"`; `verification_status` is `"user_confirmed"`; `export_policy` is `"KEEP"`; a new `validity_horizon` (with `horizon_basis_ref`) is set only when the re-confirmation constituted a new basis.
