# CorrectionDelta Ledger Schema and F3b Read Contract

This reference defines the append-only `CorrectionDelta` ledger that the F3b transformation-provenance phase reads, and the contract by which F3b decides whether an item is corrected-in-session. In v1 the ledger is consumed read-only.

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
| `corrected_at` | timestamp | When the correction was recorded |
| `corrected_by` | "User" \| "Tool" \| "AI" | Who recorded the correction |
| `supersedes` | string[] | `id`s of earlier records this correction revises |
| `validity_horizon` | duration \| null | How long the correction stays valid, when bounded |
| `export_policy` | "KEEP" \| "ROUTE" \| "DROP" | The disposition this correction carries into a handoff |
| `verification_status` | "observed" \| "user_confirmed" \| "tool_confirmed" \| "provisional" | The confidence channel that settled the correction |

`StableRef` is `{ kind: "path" | "url" | "id" | "command", locator: string }`. `InlineEvidence` is `{ content: string }`.

## F3b read contract

F3b reads the ledger and applies one predicate per context item:

```
corrected_in_session(item) ≡
  ∃ d ∈ ledger :
    d.subject_ref = ref(item)
    ∧ d.export_policy = "KEEP"
    ∧ d.verification_status ≠ "provisional"
```

The verdict is binary — a CorrectedKeep-or-complement partition:

- **CorrectedKeep** — the predicate holds: a matching record carries `export_policy = KEEP` with a non-provisional status. The item is eligible for the KEEP disposition.
- **Unknown** — every other ledger state: the ledger is absent, no record matches `subject_ref = ref(item)`, the only matching record is `provisional`, or the matching record carries a non-KEEP `export_policy` (ROUTE or DROP). The item's provenance is undecided: it appends to the residual ledger with reason `unknown-provenance` and routes to the Gate for user judgment. A ROUTE or DROP correction records the author's intent, but F3b grants no disposition from it — provenance authority is the KEEP hard line only; ROUTE and DROP dispositions are reached through F3a relevance or the Gate.

## The hard line

F3b never infers KEEP from how settled an item looks. KEEP is reachable only two ways: a matching non-provisional `CorrectionDelta` with `export_policy = KEEP`, or a user `Resolve` answer at the Gate. Absence of evidence is `Unknown`, surfaced for judgment — not silent retention. This keeps a fresh recipient from inheriting an author's unverified belief as a settled fact.

## Supersession

When a correction is itself later corrected, the newer record lists the older record's `id` in `supersedes`. F3b reads the effective correction as the most recent non-superseded record for a given `subject_ref`. A superseded record does not grant KEEP even if its own `export_policy` was KEEP.
