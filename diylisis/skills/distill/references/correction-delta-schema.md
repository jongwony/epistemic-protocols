# CorrectionDelta Ledger Schema and F3b Read Contract

This reference defines the append-only `CorrectionDelta` ledger that the F3b transformation-provenance phase reads, and the contract by which F3b decides an item's provenance. F3b consumes the ledger read-only; the F7 re-distillation emit appends to it (Rule 19).

**The ledger is conditional on `handoff_durability` (Change A).** It is maintained only under `handoff_durability = DurableRepo` (a durable, re-distilled in-repo handoff). Under `OneShot` (temporary, used once) and `ExternalVersioned` (a Notion/Linear/externally-versioned target) no ledger is maintained — `Λ.ledger = Unknown` — so `CorrectedKeep` is unreachable in those modes; a correction-requiring claim is handled by ObservedKeep against an external version handle (ExternalVersioned) or by a Gate Resolve (OneShot).

**The F3b verdict is ternary (Change B): `CorrectedKeep | ObservedKeep | Unknown`.** This reference owns the `CorrectedKeep`/`Unknown` ledger-read contract below; `ObservedKeep` — KEEP from a durable, directly-observable source with support-integrity and *no* correction record — is defined in SKILL.md (`observable_basis`, Rule 7) and summarized here for the partition.

## Storage format

The ledger is a JSON Lines (JSONL) file: one `CorrectionDelta` object per line, append-only, in correction order. A conventional location is a per-session file such as `~/.claude/.write/correction-delta-<session>.jsonl`. It is maintained only under `DurableRepo`. When no ledger file exists (or the mode keeps none), F3b does **not** route every item to the Gate: an item with a durable observable basis is `ObservedKeep` (KEPT directly), and only an item with no observable basis and no delta is `Unknown` and routes to the Gate.

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

`StableRef` is `{ kind: "path" | "url" | "id" | "command", locator: string, lifetime: "durable" | "volatile" }`. `InlineEvidence` is `{ content: string }`.

**Temporal encoding.** `corrected_at` is an ISO 8601 UTC timestamp (`Z`-suffixed); `validity_horizon` is an ISO 8601 duration in P-notation (e.g. `P7D` for seven days); the expiry sum `corrected_at + validity_horizon` is evaluated in UTC.

## F3b read contract

F3b reads the ledger and applies one predicate per context item:

```
effective_delta(item) ≡
  the most-recent non-superseded d ∈ ledger with d.subject_ref = ref(item)
  (∅ when the ledger is absent or carries no matching record)

expired(d) ≡
  d.validity_horizon ≠ null ∧ now > d.corrected_at + d.validity_horizon
  (now is the invocation constant, bound once into the protocol mode state at Phase 0 — independent of the conditional ledger bind, only evaluated under DurableRepo where deltas exist; the sum is evaluated in UTC)

corrected_in_session(item) ≡
  effective_delta(item) = d
    ∧ d.export_policy = "KEEP"
    ∧ d.verification_status ≠ "provisional"
    ∧ ¬expired(d)
  (reachable only under DurableRepo — effective_delta = ∅ in the other modes)

observable_basis(item) ≡        # defined in SKILL.md; summarized here for the partition
  durable_observable_source(item) ∧ support_integrity(item)
  where durable_observable_source(item) ≡
      ( grounding(item) = Inline(e) ∧ origin(item) ∈ {DocumentRead, ToolOutput} )   # a file read, a command's captured output
    ∨ ( grounding(item) = StablePointer(r) ∧ r.lifetime = durable )                 # a path, a PR/issue url, a stable id
  and support_integrity(item) ≡ the kept value is recipient-verifiable (a verification command, a
      resolvable url/id, or the inline observed content directly evidencing the claim) — not mere
      currency; an uncertain or contested basis is conservatively false (→ Unknown → Gate)
```

The verdict is ternary — `CorrectedKeep | ObservedKeep | Unknown`:

- **CorrectedKeep** — `corrected_in_session(item)` holds (DurableRepo only): a matching record carries `export_policy = KEEP` with a non-provisional status and an unlapsed `validity_horizon` (`¬expired(d)`). The ledger's KEEP authority, reserved for corrected, disputed, stale, or user-constituted claims. The item is eligible for the KEEP disposition.
- **ObservedKeep** — `effective_delta(item) = ∅ ∧ observable_basis(item)`: no correction record AND a durable, directly-observable source coupled to the kept value by support-integrity. The item is **KEPT directly — no ledger, no Gate**. This is the default path for ordinary source-backed state and the move that collapses the common-case gate storm.
- **Unknown** — every remaining state: the matching record is `provisional`, carries a non-KEEP `export_policy` (ROUTE or DROP), or is an expired KEEP record (reason `horizon-expired`, presented at the Gate as re-verification — never silently re-asserted as ObservedKeep); OR there is no delta and no observable basis (an AIInference, a bare in-session UserStatement, or a contested basis, reason `unknown-provenance`). The item appends to the residual ledger and routes to the Gate for user judgment. A ROUTE or DROP correction records the author's intent, but F3b grants no disposition from it — provenance authority is the KEEP hard line only; ROUTE and DROP dispositions are reached through F3a relevance or the Gate.

## The hard line

F3b never infers KEEP from how settled an item *looks*. KEEP is reachable exactly three ways: a matching non-provisional `CorrectionDelta` with `export_policy = KEEP` (CorrectedKeep); a durable, directly-observable source coupled to the item by support-integrity, with no correction record (ObservedKeep); or a user `Resolve` answer at the Gate. The ObservedKeep path is not "inferring KEEP from appearance" — it is relay against an external, recipient-re-observable basis (a file read, a command's output, a resolvable url/id), which is exactly what distinguishes it from an author's unverified belief. A claim with no such observable basis and no delta is `Unknown`, surfaced for judgment — not silent retention. This keeps a fresh recipient from inheriting an author's unverified belief as a settled fact while letting ordinary source-backed state through without a gate storm. The hard line that a **correction-requiring claim still needs the ledger** holds: a claim that diverges from its observable source (corrected, disputed, stale) has a contested or absent observable basis, so it cannot be ObservedKeep — it is held by a CorrectionDelta (DurableRepo) or surfaced at the Gate. An expired KEEP record grants nothing: its unattended authority lapses and the item is surfaced for re-verification (never silently re-asserted as ObservedKeep) — expiry is a question, never a silent retention or a silent deletion.

## Validity horizon

**Writer rule — constituted transcription only.** A `validity_horizon` is set in exactly two legal ways: transcribed from a temporal indexical present in user-constituted content (a user statement, user-supplied evidence), or set directly by the user at the Gate. Model classification of how perishable a claim "looks" is forbidden as a horizon source.

**Basis requirement.** A set horizon carries `horizon_basis_ref` — the stable reference or inline evidence naming the constituted content the horizon was transcribed from. A horizon without a basis is not `ledger_emit_clean`: the F6 `unclean_deltas` measure leg counts it and blocks the fixed point until the delta is rewritten with its basis (or the horizon removed).

**Expiry consequence.** When `now > corrected_at + validity_horizon` (with `now` fixed once per distillation invocation, at Phase 0 — independent of the conditional ledger bind; only evaluated under DurableRepo where deltas exist), the delta's unattended KEEP authority lapses: F3b yields Unknown and the item surfaces at the Gate as a re-verification question (reason: `horizon-expired`). Expiry never removes, suppresses, or rewrites the delta, and never demotes the item to DROP.

**Legacy null-basis records.** A read delta carrying a `validity_horizon` without `horizon_basis_ref` (legacy/foreign) is still evaluated for expiry — the conservative direction, since expiry only routes to the Gate; the basis requirement binds the write side this protocol emits.

Worked example — a user states "these creds rotate every Friday", so a 7-day horizon is transcribed:

```json
{"id": "cd-0042", "subject_ref": {"kind": "path", "locator": ".env.staging", "lifetime": "durable"}, "claim_kind": "credential-value", "original_ref": null, "original_claim_hash": null, "corrected_claim": "Staging DB credentials are the values in .env.staging as of 2026-06-05", "correction_basis_ref": {"content": "User: rotated staging creds this morning"}, "corrected_at": "2026-06-05T10:12:00Z", "corrected_by": "User", "supersedes": [], "validity_horizon": "P7D", "horizon_basis_ref": {"content": "User: these creds rotate every Friday"}, "export_policy": "KEEP", "verification_status": "user_confirmed"}
```

Counterexample: the model judging "credentials feel perishable, assign 7 days" is forbidden — no temporal indexical was constituted.

## Supersession

When a correction is itself later corrected, the newer record lists the older record's `id` in `supersedes`. F3b reads the effective correction as the most recent non-superseded record for a given `subject_ref`. A superseded record does not grant KEEP even if its own `export_policy` was KEEP.

When the superseding record re-confirms a horizon-expired correction (a Gate Resolve under re-distillation), its fields are fixed by SKILL.md Rule 20, not inferred: `supersedes` lists the expired record's `id`; `subject_ref` and `claim_kind` carry over; `corrected_claim` restates the re-confirmed value positively; `correction_basis_ref` names the user's Resolve answer at the Gate; `corrected_at` is the invocation timestamp; `corrected_by` is `"User"`; `verification_status` is `"user_confirmed"`; `export_policy` is `"KEEP"`; a new `validity_horizon` (with `horizon_basis_ref`) is set only when the re-confirmation constituted a new basis.
