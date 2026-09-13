# Codex Host

Load at source selection. Resolve the executable, version, and selected configuration
in the reviewed checkout. Use the first read-only review call to establish the child
process's authentication and advertised skills in that environment.

- `codex`: spawn a fresh `codex exec` in the reviewed checkout. Use
  [Codex CLI](source-adapter-codex.md) after designation. Do not resume/fork the
  driving conversation: the reviewer receives the diff pointer and design intent.
- `code-review`: load [Claude review output](source-adapter-code-review.md), reuse
  matching invocation evidence, and launch the read-only review below. Confirm the
  selected `/code-review` implementation from the print-mode session's startup and
  skill expansion; a matching plugin display name alone leaves that identity open.

## Claude print-mode call

In the reviewed checkout, create a unique temporary directory and a prompt file.
Start the prompt with the exact advertised skill command (`/code-review`, or its
installed namespace), followed by the captured local diff pointer, changed files,
and design-intent bundle. Ask for a read-only review returned to the caller.
Pass the prompt as data, not shell source:

```bash
review_request=$(cat "$review_dir/prompt.txt")
claude -p "$review_request" --output-format stream-json --verbose \
  > "$review_dir/events.jsonl" 2> "$review_dir/stderr.txt"
review_status=$?
printf '%s\n' "$review_status" > "$review_dir/status.txt"
```

Use the host's supervised execution and completion mechanism. Collect `status.txt`,
the event stream including its terminal result envelope, and all stderr.
The status file preserves the child exit code after the launcher shell ends. A successful result requires a present, readable status file containing zero
and a successful terminal envelope (including `is_error`/`subtype` where present) and readable review
content in `result`. Authentication failures can arrive in stdout; a nonempty result
is not enough. Normalize the inner review with the selected adapter, retaining the
raw envelope when it cannot be understood. Remove temporary files after capture.

For an unfamiliar CLI version or changed invocation options, check `claude --help`.
Preflight ends with executable, version, configuration, and invocation resolution;
remaining capability evidence comes from the review call. For a contract mismatch,
inspect the relevant help, exposed skill text, or call diagnostics and retain any
unresolved limit on the trace.
Keep the selected skill discoverable: `--bare` skips automatic discovery, and
`--disable-slash-commands` removes skills. Use the host's normal permission settings;
this recipe grants no bypass or write permission. Missing skill expansion, denied
required reads, or review of a different scope is an incomplete call, not approval.

Sources: [programmatic Claude Code](https://code.claude.com/docs/en/headless),
[CLI reference](https://code.claude.com/docs/en/cli-reference).
