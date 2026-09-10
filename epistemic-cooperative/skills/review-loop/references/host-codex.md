# Codex Host

Load at source selection. Codex driving the loop does not make either CLI available:
resolve the executable, authentication/configuration, and required skills separately.
A child process starts with its own tools and configuration; parent tools, credentials,
and mounted paths are not a promised child capability.

- `codex`: spawn a fresh `codex exec` in the reviewed checkout. Use
  [Codex CLI](source-adapter-codex.md) after designation. Do not resume/fork the
  driving conversation: the reviewer receives the diff pointer and design intent.
- `code-review`: requires `claude` and a `/code-review` implementation available to
  its print-mode session. Inspect its local contract before advertising it, including
  local-scope support and output/reach limits. A plugin with the same display name
  may implement a different review. Load [Claude review output](source-adapter-code-review.md)
  after designation, then launch as below.

## Claude print-mode call

In the reviewed checkout, create a unique temporary directory and a prompt file.
Start the prompt with the exact advertised skill command (`/code-review`, or its
installed namespace), followed by the captured local diff pointer, changed files,
and design-intent bundle. Ask for a read-only review returned to the caller.
Pass the prompt as data, not shell source:

```bash
review_request=$(cat "$review_dir/prompt.txt")
claude -p "$review_request" --output-format json \
  > "$review_dir/result.json" 2> "$review_dir/stderr.txt"
review_status=$?
printf '%s\n' "$review_status" > "$review_dir/status.txt"
```

Use the host's supervised execution and completion mechanism. Collect `status.txt`, the whole JSON envelope, and all stderr.
The status file preserves the child exit code after the launcher shell ends. A successful result requires a present, readable status file containing zero
and a successful terminal envelope (including `is_error`/`subtype` where present) and readable review
content in `result`. Authentication failures can arrive in stdout; a nonempty result
is not enough. Normalize the inner review with the selected adapter, retaining the
raw envelope when it cannot be understood. Remove temporary files after capture.

Check `claude --help` and the installed skill for the supported invocation. Print
mode can expand user-invoked skills; terminal-only commands cannot be assumed to work.
Keep the selected skill discoverable: `--bare` skips automatic discovery, and
`--disable-slash-commands` removes skills. Use the host's normal permission settings;
this recipe grants no bypass or write permission. Missing skill expansion, denied
required reads, or review of a different scope is an incomplete call, not approval.

Sources: [programmatic Claude Code](https://code.claude.com/docs/en/headless),
[CLI reference](https://code.claude.com/docs/en/cli-reference).
