#!/usr/bin/env bash
# Build the isolated evaluation environment, then report what still needs a human.
#
# The isolation matters more than it looks. A normal Claude Code config loads every
# installed plugin, so an arm that omits --plugin-dir still has the protocol under
# test present by another route. That is not a baseline; it is the same treatment
# reached sideways, and it makes every delta unreadable. A config directory with
# nothing in it is the only arrangement observed to yield an empty plugin set.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() { printf 'setup: %s\n' "$1" >&2; exit 1; }

command -v claude >/dev/null 2>&1 || fail "claude not on PATH"
command -v node   >/dev/null 2>&1 || fail "node not on PATH"

node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge 22 ] || fail "node 22+ required (found $(node -v))"

node "$SKILL/scripts/harness.mjs" setup
