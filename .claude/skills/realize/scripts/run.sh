#!/usr/bin/env bash
# Run the suite. Everything except authentication is already set up by setup.sh.
#
# Authentication is deliberately not fetched here. Claude requires its token in
# the environment. Codex setup has already linked the existing ChatGPT login into
# disposable homes, or the caller supplies OPENAI_API_KEY.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

realize_runner="${REALIZE_RUNNER:-$(node -p "require('$SKILL/harness.config.json').runner || 'claude'")}"

if [ "$realize_runner" = "claude" ] && [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
  cat >&2 <<'MSG'
run: CLAUDE_CODE_OAUTH_TOKEN is not set.

Obtain one against the isolated config directory (interactive, once):

  CLAUDE_CONFIG_DIR=~/.claude-eval claude setup-token

Then export it in the same command that runs this script, so the value never
lands in a file or the shell history:

  export CLAUDE_CODE_OAUTH_TOKEN="$(<your secret manager> <path>)" && ./run.sh

The variable name is exact. CLAUDE_CODE_OAUTH_TOKEN is read; CLAUDE_OAUTH_TOKEN
is ignored in silence, and every run then fails with "Not logged in", which
reads like a broken setup-token rather than a misspelled variable.
MSG
  exit 1
fi

case "$realize_runner" in
  claude|codex) ;;
  *) printf 'run: runner must be claude or codex (found %s)\n' "$realize_runner" >&2; exit 1 ;;
esac

node "$SKILL/scripts/harness.mjs" run
node "$SKILL/scripts/harness.mjs" report
