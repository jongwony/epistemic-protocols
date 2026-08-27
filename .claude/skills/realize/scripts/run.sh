#!/usr/bin/env bash
# Run the suite. Everything except authentication is already set up by setup.sh.
#
# Authentication is deliberately not fetched here. Each runner requires its token
# in this process environment; Codex setup never consumes or persists one.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
realize_target="${1:-${REALIZE_TARGET:-}}"

if [ -z "$realize_target" ]; then
  printf 'run: target skill required (for example: ./run.sh inquire)\n' >&2
  exit 1
fi

realize_runner="${REALIZE_RUNNER:-$(node -p "require('$SKILL/harness.config.json').runner || 'claude'")}"

if [ "$realize_runner" = "claude" ] && [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
  cat >&2 <<'MSG'
run: CLAUDE_CODE_OAUTH_TOKEN is not set.

Obtain one against the isolated config directory (interactive, once):

  CLAUDE_CONFIG_DIR=~/.claude-eval/inquire claude setup-token

Then export it in the same command that runs this script, so the value never
lands in a file or the shell history:

  export CLAUDE_CODE_OAUTH_TOKEN="$(<your secret manager> <path>)" && ./run.sh inquire

The variable name is exact. CLAUDE_CODE_OAUTH_TOKEN is read; CLAUDE_OAUTH_TOKEN
is ignored in silence, and every run then fails with "Not logged in", which
reads like a broken setup-token rather than a misspelled variable.
MSG
  exit 1
fi

if [ "$realize_runner" = "codex" ] && [ -z "${CODEX_API_KEY:-}" ]; then
  cat >&2 <<'MSG'
run: CODEX_API_KEY is not set.

Codex setup consumes and stores no credential. Supply CODEX_API_KEY only to this
run process; the harness forwards it only to each `codex exec` child.
MSG
  exit 1
fi

case "$realize_runner" in
  claude|codex) ;;
  *) printf 'run: runner must be claude or codex (found %s)\n' "$realize_runner" >&2; exit 1 ;;
esac

set +e
node "$SKILL/scripts/harness.mjs" run "$realize_target"
run_status=$?
node "$SKILL/scripts/harness.mjs" report "$realize_target"
report_status=$?
set -e

if [ "$run_status" -ne 0 ]; then exit "$run_status"; fi
exit "$report_status"
