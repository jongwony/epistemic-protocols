#!/usr/bin/env bash
# Remove what a run leaves behind, at one of three depths.
#
# Nothing here is irreplaceable. Authentication arrives through the environment
# rather than the config directory -- the init event reports `apiKeySource: "none"`
# -- so there is no credential to preserve and no re-login to schedule.
#
#   (default)  volatile state only; the fixture survives, `run` works immediately
#   --all      the config directory and scratch trees; `setup` must run again
#   --purge    the above plus results
#
# --purge is the one that loses something. Results are observations, not a cache:
# re-running produces different transcripts, so what it discards cannot be
# regenerated, only replaced.
set -euo pipefail

SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ "${1:-}" = "--purge" ]; then
  printf 'teardown --purge discards recorded runs under %s/results.\n' "$SKILL" >&2
  printf 'Re-running produces different transcripts; these observations do not come back.\n' >&2
  printf 'Type PURGE to continue: ' >&2
  read -r reply
  [ "$reply" = "PURGE" ] || { printf 'teardown: aborted\n' >&2; exit 1; }
fi

node "$SKILL/scripts/harness.mjs" teardown "${@}"
