## Codex Mapping

For Codex runtime, convert `AskUserQuestion` stages into `request_user_input` through canonical step routing:

- Source profile: `codex/examples/katalepsis.json`
- Mapping contract: `codex/compat/request-user-input-mapping.md`
- Schema: `codex/schemas/canonical-prompt.schema.json`

### Step Mapping (Pilot)

| AskUserQuestion Stage | Codex Canonical Steps | Rule |
|-----------------------|-----------------------|------|
| Phase 1 entry point selection (`multiSelect`, max 4 categories) | `phase1_category_router` → `phase1_category_detail` → `phase1_category_continue` | required `two_stage_routing` + iterative selection |
| Phase 3 comprehension verification | `phase3_probe` | direct |
| Phase 3 next-action gate | `phase3_next_action` | explicit continue/advance/stop |
| Phase 3 post-correction proposal (Step 3c) | `phase3_proposal_inline` | direct; conditional on correction |
| Phase 3 coverage proposal (Step 3d) | `phase3_proposal_coverage` | direct |

### Task Mapping (Codex)

| Source Task Event | Codex Tool | Rule |
|-------------------|------------|------|
| Register selected categories (`TaskCreate`) | `update_plan` step create | mandatory; default status `pending` |
| Category starts (`TaskUpdate`: `pending → in_progress`) | `update_plan` status sync | emitted |
| Category mastered (`TaskUpdate`: `in_progress → completed`) | `update_plan` status sync | emitted |
| Proposal ejection (`TaskCreate`) | `update_plan` step create | optional; does not affect plan convergence |
| Non-critical TaskUpdate transitions | internal runtime state | no `update_plan` call |

### Codex Constraints

- Every step must declare `intent`.
- Every step must declare `on_escape` (`terminate` default).
- Source options > 3 require `two_stage_routing` decomposition.
- Effective multi-select uses repeated single-choice turns with explicit continuation.
- `TaskCreate` must map to `update_plan` step creation.
- `TaskUpdate` maps only for `pending → in_progress` and `in_progress → completed`.
- Keep at most one `in_progress` item in `update_plan`.
- If `update_plan` is unavailable, keep Task state internally (`internal_state_only`).

### Verification Style

**Socratic verification**: Ask rather than tell.

Instead of:
```
"This function does X because of Y."
```

Use:
```
"What do you think this function does?"
→ If correct: "That's right. Ready for the next part?"
→ If incorrect: "Actually, it does X. Does that make sense now?"
```

**Chunking**: Break complex changes into digestible pieces. Verify each chunk before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

### Progress Tracking

| Phase | Task Operation |
|-------|----------------|
| Phase 2 | TaskCreate for ALL selected categories |
| Phase 3 start | TaskUpdate current category to `in_progress` |
| Comprehension verified | TaskUpdate to `completed` |
| Move to next | TaskUpdate next to `in_progress` |

**Convergence**: Mode terminates when all tasks show `completed` or user explicitly exits.
