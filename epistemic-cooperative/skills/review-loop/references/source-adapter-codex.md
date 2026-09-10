# Codex CLI Adapter

Use from either host after `source=codex` is designated. Start a fresh child context
in the reviewed checkout, passing the request through stdin. Resolve the executable and check
`codex exec --help` for installed flag support.
Unless the user specifies otherwise, retain the review recipe's `gpt-6-astra` model
and select effort by the diff: `high` for small mechanical work, `xhigh` for substantive
work, `max` for the most demanding reviews. Record the actual setting. A child using
the driving model remains a separate context, not a different-model comparison.

## Request

Write the prompt to a unique temporary directory (`mktemp -d`). Include:

- PR pointer: `git diff {base_sha}...{head_sha}`, where the captured base is the
  resolved diff cut and head is the current repair landing.
- Working-tree pointer: `git diff {captured_base}` plus each untracked file from
  `git status --porcelain --untracked-files=all`; ask the reviewer to read those files.
- Changed-file list and the current design-intent bundle from Phase 0: repository
  pointers, constituted decisions and their basis, declared authority order or its
  absence, and mission pointer or the recorded absence of a declared goal.
- The Source Interface output: findings, `VERDICT: approve | needs-attention`,
  `EXERCISED:` on every verdict, and optional `DIRECTION:` with a falsifier after
  findings on a non-approval. Convey the mission-based severity calibration.

Ask explicitly about closure across the whole changed artifact, not only hunks.
Report what this call examined or executed and what it could not reach; a sandbox's
capabilities do not establish exercise. Convey decisions descriptively and leave
the reviewer free to flag a defect those decisions cause. Give it no prior fix
statuses, dispositions, hypotheses, or requested verdict.

## Execution and collection

Run through the host's supervised/background execution facility and wait for its
completion signal. This command is the ordinary prompt-based route:

```bash
codex exec --ephemeral --json --color never --cd "$review_repo" \
  -m "$review_model" -c "model_reasoning_effort=\"$review_effort\"" \
  --sandbox read-only - \
  < "$review_dir/prompt.txt" \
  > "$review_dir/events.jsonl" 2> "$review_dir/stderr.txt"
review_status=$?
printf '%s\n' "$review_status" > "$review_dir/status.txt"
```

Set `review_model` and `review_effort` as above before launch. If the installed
CLI/model does not support that selection, report the limitation rather than
silently substituting. Keep the captured revisions locally available.
A child unable to read a revision
or the required files has not completed the requested review.

Stdout is **not pure JSONL**: plain notice lines may accompany events. The filter
below is load-bearing because one notice otherwise makes `jq -rs` reject the stream.
Extract the last completed `agent_message`; earlier ones can be progress reports:

```bash
grep '^{' "$review_dir/events.jsonl" \
  | jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty'
```

Read the child exit code from `status.txt` and inspect terminal events too: progress followed by `turn.failed`
or nonzero exit is not a successful review. Read the extracted narrative verbatim
as an LLM, checking that it actually contains a review verdict on the requested
surface. An empty extraction has no verdict. If extraction fails, inspect raw events
before deciding whether the source failed. Read **all** stderr on every outcome,
including success; state when it was empty. Capture the results before removing the
temporary directory. A terminal failure follows Phase 1's no-review path.

When the user requests a curated review skill or Codex's native review mode, read
[Codex review options](codex-review-options.md). These change the child review recipe,
not the host/source matrix or the loop's disposition authority.
