#!/usr/bin/env bash
# Build the isolated evaluation environment, then report what still needs a human.
#
# The isolation matters more than it looks. Ambient marketplace plugins turn a
# nominal baseline into the treatment by another route. The harness gives Claude
# an empty config directory and Codex separate bare/protocol homes.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() { printf 'setup: %s\n' "$1" >&2; exit 1; }

command -v node   >/dev/null 2>&1 || fail "node not on PATH"

node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge 22 ] || fail "node 22+ required (found $(node -v))"

realize_runner="${REALIZE_RUNNER:-$(node -p "require('$SKILL/harness.config.json').runner || 'claude'")}"
case "$realize_runner" in
  claude) command -v claude >/dev/null 2>&1 || fail "claude not on PATH" ;;
  codex)  command -v codex  >/dev/null 2>&1 || fail "codex not on PATH" ;;
  *) fail "runner must be claude or codex (found $realize_runner)" ;;
esac

node "$SKILL/scripts/harness.mjs" setup
