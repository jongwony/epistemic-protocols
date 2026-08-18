#!/usr/bin/env bash
# Run the suite. Everything except authentication is already set up by setup.sh.
#
# Authentication is deliberately not fetched here. The token's location is a
# property of whoever is running this, not of the repository, so this script
# refuses to guess: export it from wherever it lives and invoke.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
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

node "$SKILL/scripts/harness.mjs" run
node "$SKILL/scripts/harness.mjs" report
