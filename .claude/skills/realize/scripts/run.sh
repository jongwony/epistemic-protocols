#!/usr/bin/env bash
# Run the suite. Everything except authentication is already set up by setup.sh.
#
# Authentication is deliberately not fetched here. Each runner requires its token
# in this process environment; Codex setup never consumes or persists one. The one
# exception is opt-in: REALIZE_CODEX_AUTH=login borrows the codex login already on this
# machine, linked into a disposable home only while each `codex exec` runs.
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

codex_auth="${REALIZE_CODEX_AUTH:-api-key}"

if [ "$realize_runner" = "codex" ] && [ "$codex_auth" = "api-key" ] && [ -z "${CODEX_API_KEY:-}" ]; then
  cat >&2 <<'MSG'
run: CODEX_API_KEY is not set.

Codex setup consumes and stores no credential. Supply CODEX_API_KEY only to this
run process; the harness forwards it only to each `codex exec` child.

Or borrow the codex login already on this machine (ChatGPT sign-in):

  REALIZE_CODEX_AUTH=login REALIZE_RUNNER=codex ./run.sh <target>

Its auth.json is symlinked into the disposable home for the span of each
`codex exec` and removed straight after; nothing is copied.
MSG
  exit 1
fi

if [ "$realize_runner" = "codex" ] && [ "$codex_auth" = "login" ]; then
  # The harness removes each link as soon as its child exits. This trap is the backstop
  # for a harness that never reached its own cleanup; it removes links only, and names a
  # regular auth.json left in a link's place without touching it.
  trap 'node "$SKILL/scripts/harness.mjs" release-login "$realize_target" || true' EXIT
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
